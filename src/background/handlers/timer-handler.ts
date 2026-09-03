const ALARM_NAME = 'ypp-focus-timer';

export async function startTimer(durationMinutes = 25) {
  try {
    const endTime = Date.now() + durationMinutes * 60 * 1000;

    await chrome.storage.local.set({
      timerState: { isRunning: true, endTime: endTime, duration: durationMinutes },
    });

    chrome.alarms.create(ALARM_NAME, { when: endTime });
  } catch (error) {
    console.error('[YPP] Error starting timer:', error);
  }
}

export async function stopTimer() {
  try {
    await chrome.storage.local.set({
      timerState: { isRunning: false, endTime: null, duration: 25 },
    });
    await chrome.alarms.clear(ALARM_NAME);
  } catch (error) {
    console.error('[YPP] Error stopping timer:', error);
  }
}

export function handleAlarm(alarm: chrome.alarms.Alarm) {
  if (alarm.name === ALARM_NAME) {
    stopTimer();
    try {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'src/assets/icons/icon.svg',
        title: 'Focus Session Complete',
        message: 'Great job! Take a break.',
        priority: 2,
      });
    } catch (error) {
      console.error('[YPP] Error creating notification:', error);
    }
  }
}

export async function handleGetTimer(sendResponse: (response: any) => void) {
  try {
    const data = await chrome.storage.local.get('timerState');
    const state: { isRunning: boolean; endTime: number | null } = data.timerState || { isRunning: false, endTime: null };
    let timeLeft = 0;

    if (state.isRunning && state.endTime) {
      timeLeft = Math.max(0, Math.floor((state.endTime - Date.now()) / 1000));
      if (timeLeft === 0) {
        stopTimer();
        state.isRunning = false;
      }
    }
    sendResponse({ isRunning: state.isRunning, timeLeft });
  } catch (error) {
    console.error('[YPP] Error getting timer state:', error);
    sendResponse({ isRunning: false, timeLeft: 0 });
  }
}
