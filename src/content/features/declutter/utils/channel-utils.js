const ytVideoChannelCache = {};
const YT_HIDER_CACHE_ATTR = 'data-ypp-video-cache';

function channelCacheValuesEqual(a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }
  return a === b;
}

export function readChannelCacheFromDOM() {
  try {
    const root = document.documentElement;
    if (!root) return false;
    const raw = root.getAttribute(YT_HIDER_CACHE_ATTR);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return false;
    let added = false;
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      const isValid = typeof value === 'string' || (Array.isArray(value) && value.every(v => typeof v === 'string'));
      if (!isValid) continue;
      if (!channelCacheValuesEqual(ytVideoChannelCache[key], value)) {
        ytVideoChannelCache[key] = value;
        added = true;
      }
    }
    return added;
  } catch (_) {
    return false;
  }
}

const ytChannelIdentityCache = {};
const YT_HIDER_CHANNELID_CACHE_ATTR = 'data-ypp-channelid-cache';

export function readChannelIdentityCacheFromDOM() {
  try {
    const root = document.documentElement;
    if (!root) return false;
    const raw = root.getAttribute(YT_HIDER_CHANNELID_CACHE_ATTR);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return false;
    let added = false;
    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
      const value = data[key];
      if (typeof value !== 'string') continue;
      if (ytChannelIdentityCache[key] !== value) {
        ytChannelIdentityCache[key] = value;
        added = true;
      }
    }
    return added;
  } catch (_) {
    return false;
  }
}

export function resolveChannelIdentity(channel) {
  if (!channel) return channel;
  if (Array.isArray(channel)) return channel.map(c => ytChannelIdentityCache[c] || c);
  return ytChannelIdentityCache[channel] || channel;
}

export function channelHandleFromPathname(pathname) {
  if (!pathname) return null;
  if (pathname.startsWith('/@')) return ('/' + pathname.split('/')[1]).toLowerCase();
  const channelIdMatch = pathname.match(/^\/channel\/([^/]+)/);
  if (channelIdMatch) return resolveChannelIdentity(('/channel/' + channelIdMatch[1]).toLowerCase());
  return null;
}

export function isChannelPagePath(pathname) {
  return !!pathname && (pathname.startsWith('/@') || pathname.startsWith('/channel/'));
}

export function extractChannelFromContainer(container) {
  if (!container) return null;
  const el =
    container.querySelector('a[href^="/@"]') ||
    container.querySelector('a[href^="/channel/"]') ||
    container.querySelector('a[href^="/user/"]') ||
    container.querySelector('ytd-channel-name a[href], #channel-name a[href]');
  if (el) {
    const href = el.href || el.getAttribute('href');
    if (href) {
      try {
        return resolveChannelIdentity(new URL(href, window.location.origin).pathname.toLowerCase());
      } catch (_) {}
    }
  }
  try {
    const contentEl = container.querySelector('[class*="content-id-"]');
    const match = contentEl?.className?.match(/content-id-([A-Za-z0-9_-]+)/);
    if (match?.[1] && ytVideoChannelCache[match[1]]) {
      return resolveChannelIdentity(ytVideoChannelCache[match[1]]);
    }
  } catch (_) {}
  return null;
}
