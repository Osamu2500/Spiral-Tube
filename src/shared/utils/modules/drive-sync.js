const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';

export async function findFileId(token, filename) {
  try {
    const q = encodeURIComponent(`name='${filename}' and 'appDataFolder' in parents and trashed=false`);
    const res = await fetch(`${DRIVE_FILES}?q=${q}&spaces=appDataFolder&fields=files(id,modifiedTime)`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Drive API error');
    const { files } = await res.json();
    return files?.[0] || null;
  } catch (error) {
    window.YPP?.Utils?.log(`Error finding Drive file ${filename}: ` + error.message, 'SYNC', 'error');
    return null;
  }
}

export async function pushData(token, filename, data) {
  try {
    const existing = await findFileId(token, filename);
    const metadata = { name: filename, parents: existing ? undefined : ['appDataFolder'] };
    const boundary = 'ypp-boundary-' + Date.now();
    
    let body = `--${boundary}\r\n`;
    body += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
    body += `${JSON.stringify(metadata)}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Type: application/json; charset=UTF-8\r\n\r\n`;
    body += `${JSON.stringify(data)}\r\n`;
    body += `--${boundary}--`;

    const url = existing
      ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart`
      : `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

    const res = await fetch(url, {
      method: existing ? 'PATCH' : 'POST',
      headers: { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': `multipart/related; boundary=${boundary}` 
      },
      body
    });
    
    if (!res.ok) throw new Error('Failed to upload data');
    window.YPP?.Utils?.log(`Successfully pushed ${filename} to Drive`, 'SYNC', 'debug');
    return await res.json();
  } catch (error) {
    window.YPP?.Utils?.log(`Error pushing ${filename}: ` + error.message, 'SYNC', 'error');
    throw error;
  }
}

export async function pullData(token, filename) {
  try {
    const file = await findFileId(token, filename);
    if (!file) {
      window.YPP?.Utils?.log(`No cloud file found for ${filename}`, 'SYNC', 'debug');
      return null;
    }
    const res = await fetch(`${DRIVE_FILES}/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to download data');
    const data = await res.json();
    window.YPP?.Utils?.log(`Successfully pulled ${filename} from Drive`, 'SYNC', 'debug');
    return data;
  } catch (error) {
    window.YPP?.Utils?.log(`Error pulling ${filename}: ` + error.message, 'SYNC', 'error');
    return null;
  }
}
