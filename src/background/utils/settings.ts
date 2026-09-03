export function mergeSettings(localSettings: any, syncSettings: any) {
  const syncTime = syncSettings.lastUpdated || 0;
  const localTime = localSettings.lastUpdated || 0;

  if (syncTime >= localTime) {
    return { ...localSettings, ...syncSettings };
  } else {
    return { ...syncSettings, ...localSettings };
  }
}
