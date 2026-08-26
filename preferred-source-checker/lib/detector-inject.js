/*
 * Part of Opace Preferred Source Checker.
 * Companion to lib/detector.js — injected AFTER it via
 * chrome.scripting.executeScript({ files: ['lib/detector.js', 'lib/detector-inject.js'] }).
 * The final expression's value becomes the injection result.
 */
typeof __PSC_DETECTOR__ !== 'undefined' && __PSC_DETECTOR__
  ? __PSC_DETECTOR__.runDetector()
  : { ok: false, error: 'Detector module not loaded' };
