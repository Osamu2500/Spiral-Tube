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

    const size = 10;
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

    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha < 255) continue; 
        
        // Exclude pure black (often letterboxes) and pure white
        if (data[i] < 15 && data[i+1] < 15 && data[i+2] < 15) continue;
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) continue;

        r += data[i];
        g += data[i+1];
        b += data[i+2];
        count++;
    }

    bitmap.close();

    if (count > 0) {
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        // ORIGINAL LOGIC: Boost vibrance for a better neon/polaroid glow effect!
        let max = Math.max(r, g, b);
        
        if (max === 0) {
            sendResponse({ success: true, r: 50, g: 50, b: 50 }); // Fallback dark grey
            return;
        }
        
        // Push brightness up
        let boost = 255 / max;
        boost = Math.min(boost, 1.4); // Max 40% boost to avoid washing out
        
        r = Math.min(255, Math.floor(r * boost));
        g = Math.min(255, Math.floor(g * boost));
        b = Math.min(255, Math.floor(b * boost));

        sendResponse({ success: true, r, g, b });
    } else {
        sendResponse({ success: false, error: 'No valid pixels' });
    }
  } catch (error) {
    sendResponse({ success: false, error: (error as Error).message });
  }
}
