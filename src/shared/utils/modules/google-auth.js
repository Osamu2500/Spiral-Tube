export async function signIn(interactive = true) {
  // Check our custom cache first (needed for Edge fallback)
  const data = await chrome.storage.local.get(['google_auth_token', 'google_auth_expires']);
  if (data.google_auth_token && data.google_auth_expires > Date.now()) {
    return data.google_auth_token;
  }

  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive }, (token) => {
      if (!chrome.runtime.lastError && token) {
        return resolve(token);
      }
        // Fallback to web auth flow (for Edge/Firefox)
        const manifest = chrome.runtime.getManifest();
        const clientId = manifest.oauth2?.client_id;
        const scopes = manifest.oauth2?.scopes?.join(' ');
        
        if (!clientId) {
          return reject(chrome.runtime.lastError || new Error('Auth failed: No Client ID'));
        }

        const redirectUrl = chrome.identity.getRedirectURL();
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes)}${!interactive ? '&prompt=none' : ''}`;

        chrome.identity.launchWebAuthFlow({
          url: authUrl,
          interactive: interactive
        }, (responseUrl) => {
          if (chrome.runtime.lastError || !responseUrl) {
            return reject(chrome.runtime.lastError || new Error('Web Auth failed'));
          }
          
          const url = new URL(responseUrl);
          // Handle both success (#access_token=...) and error (#error=...)
          const params = new URLSearchParams(url.hash.substring(1) || url.search.substring(1));
          
          if (params.get('error')) {
            return reject(new Error('Auth error: ' + params.get('error')));
          }

          const accessToken = params.get('access_token');
          const expiresIn = parseInt(params.get('expires_in') || '3600', 10);
          
          if (accessToken) {
            const expires = Date.now() + (expiresIn * 1000) - 60000; // 1 min buffer
            chrome.storage.local.set({
              google_auth_token: accessToken,
              google_auth_expires: expires
            }, () => resolve(accessToken));
          } else {
            reject(new Error('No access token in auth response'));
          }
        });
    });
  });
}

export async function signOut() {
  try {
    const token = await signIn(false);
    
    // Clear custom cache including the persistent user info
    await chrome.storage.local.remove(['google_auth_token', 'google_auth_expires', 'ypp_cached_user_info']);
    
    if (!token) return;
    
    // Revoke token with Google
    await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);
    
    // Remove from Chrome cache
    return new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        resolve();
      });
    });
  } catch (error) {
    // If signIn(false) fails, we're likely already signed out
    window.YPP?.Utils?.log('Sign out error or already signed out', 'AUTH', 'debug');
  }
}

export async function getUserInfo(token) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch user info');
    return await res.json(); // { email, name, picture, ... }
  } catch (error) {
    window.YPP?.Utils?.log('Error fetching user info: ' + error.message, 'AUTH', 'error');
    return null;
  }
}

export async function checkAuthStatus() {
  try {
    const token = await signIn(false);
    if (token) {
      const userInfo = await getUserInfo(token);
      if (userInfo) {
        // Cache user info persistently so UI doesn't log out if token expires while laptop sleeps
        await chrome.storage.local.set({ ypp_cached_user_info: userInfo });
        return { token, userInfo, isAuthenticated: true };
      }
    }
  } catch (e) {
    window.YPP?.Utils?.log('Auth check failed silently, checking cache', 'AUTH', 'debug');
  }

  // Fallback: If token expired and silent refresh failed, assume still logged in for UI purposes
  const data = await chrome.storage.local.get('ypp_cached_user_info');
  if (data.ypp_cached_user_info) {
    return { token: null, userInfo: data.ypp_cached_user_info, isAuthenticated: true };
  }

  return { token: null, userInfo: null, isAuthenticated: false };
}
