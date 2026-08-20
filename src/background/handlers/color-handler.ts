export async function handleExtractColor(url: string, sendResponse: (response: any) => void) {
  try {
    if (typeof OffscreenCanvas === 'undefined') {
      return sendResponse({ success: false, error: 'OffscreenCanvas not supported' });
    }

    // Security: Only allow extracting colors from YouTube image domains
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (_) {
      return sendResponse({ success: false, error: 'Invalid URL' });
    }

    const ALLOWED_DOMAINS = ['i.ytimg.com', 'yt3.ggpht.com', 'yt3.googleusercontent.com'];
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname) || parsedUrl.protocol !== 'https:') {
      return sendResponse({ success: false, error: 'Disallowed domain or protocol' });
    }

    const response = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!response.ok) throw new Error('Fetch failed');

    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    const size = 16;
    let canvas;
    try {
      canvas = new OffscreenCanvas(size, size);
    } catch (e) {
      return sendResponse({ success: false, error: 'Failed to create OffscreenCanvas' });
    }
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
       return sendResponse({ success: false, error: 'Failed to get context' });
    }
    ctx.drawImage(bitmap, 0, 0, size, size);

    const imageData = ctx.getImageData(0, 0, size, size).data;
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    const skip = 4 * 3; // Sample every 3rd pixel

    for (let i = 0; i < imageData.length; i += skip) {
      // Ignore pixels that are too dark (letterboxing)
      if (imageData[i] > 15 || imageData[i + 1] > 15 || imageData[i + 2] > 15) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }
    }

    bitmap.close();

    if (count > 0) {
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);
      sendResponse({ success: true, r, g, b });
    } else {
      sendResponse({ success: false, error: 'No valid pixels' });
    }
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
}
