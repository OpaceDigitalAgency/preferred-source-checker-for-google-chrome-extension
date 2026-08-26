/*
 * Part of Opace Preferred Source Checker.
 * Audit history storage (spec §2.5). v1 writes silently; no UI until v1.1.
 * Wraps chrome.storage.local. Key is injectable so the Essential SEO Toolkit
 * can use a prefixed key (psc_auditHistory) without clashing.
 */

const MAX_ENTRIES = 200;

/**
 * @param {string} storageKey key in chrome.storage.local
 * @param {object} [storageArea] injectable for testing; defaults to chrome.storage.local
 */
export function createHistory(storageKey = 'auditHistory', storageArea = undefined) {
  function area() {
    if (storageArea) return storageArea;
    /* global chrome */
    return chrome.storage.local;
  }

  async function readAll() {
    const data = await area().get(storageKey);
    const list = data && Array.isArray(data[storageKey]) ? data[storageKey] : [];
    return list;
  }

  /**
   * Record one audit. One entry per host per UTC day: a re-audit of the same
   * host on the same UTC day overwrites the existing entry. Most recent
   * first, capped at MAX_ENTRIES (oldest evicted).
   * @param {{ ts:number, host:string, displayDomain:string, eligibility:string,
   *           summary:'implemented'|'partial'|'deeplink-only'|'none',
   *           mode:string, sdk:boolean, buttonCount:number,
   *           rendered:boolean, deeplinks:number }} entry
   */
  async function record(entry) {
    const list = await readAll();
    const day = new Date(entry.ts).toISOString().slice(0, 10);
    const filtered = list.filter((e) => {
      const eDay = new Date(e.ts).toISOString().slice(0, 10);
      return !(e.host === entry.host && eDay === day);
    });
    filtered.unshift(entry);
    if (filtered.length > MAX_ENTRIES) filtered.length = MAX_ENTRIES;
    await area().set({ [storageKey]: filtered });
  }

  async function list() {
    return readAll();
  }

  async function clear() {
    await area().remove(storageKey);
  }

  /** RFC 4180 CSV of the audit history (spec §2.5). */
  function toCsv(entries) {
    const esc = (v) => {
      const s = String(v === null || v === undefined ? '' : v);
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const rows = [
      'date_iso,host,display_domain,eligibility_state,summary,mode,sdk_present,button_count,rendered,deeplink_count'
    ];
    for (const e of entries) {
      rows.push([
        new Date(e.ts).toISOString(), e.host, e.displayDomain, e.eligibility,
        e.summary, e.mode, e.sdk, e.buttonCount, e.rendered, e.deeplinks
      ].map(esc).join(','));
    }
    return rows.join('\r\n') + '\r\n';
  }

  return { record, list, clear, toCsv };
}
