export type BrowserProfile = 'default' | 'ios-safari';

export function detectBrowserProfile(): BrowserProfile {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'default';
  }

  const ua = navigator.userAgent;
  const platform = navigator.platform ?? '';
  const maxTouchPoints = navigator.maxTouchPoints ?? 0;

  const isAppleTouchDevice =
    /iPad|iPhone|iPod/i.test(ua) ||
    (platform === 'MacIntel' && maxTouchPoints > 1);
  const isWebKit = /WebKit/i.test(ua);
  const isOtherIosBrowser = /CriOS|EdgiOS|FxiOS|OPiOS|DuckDuckGo/i.test(ua);
  const isSafari = isWebKit && !isOtherIosBrowser;

  return isAppleTouchDevice && isSafari ? 'ios-safari' : 'default';
}
