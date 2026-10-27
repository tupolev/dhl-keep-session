"use strict";

const ALARM_NAME = "dhl-meine-sendungen-keepalive";
const DHL_TABS = "https://www.dhl.de/de/privatkunden/kundenkonto/meine-sendungen.html*";

async function ensureAlarm() {
  const existing = await browser.alarms.get(ALARM_NAME);
  if (!existing) {
    browser.alarms.create(ALARM_NAME, { periodInMinutes: 3 });
  }
}

browser.runtime.onInstalled.addListener(ensureAlarm);
browser.runtime.onStartup.addListener(ensureAlarm);
void ensureAlarm();

browser.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  try {
    const tabs = await browser.tabs.query({ url: DHL_TABS });
    for (const tab of tabs) {
      if (tab.id == null || tab.discarded) continue;
      try {
        await browser.tabs.sendMessage(tab.id, { type: "DHL_KEEPALIVE" });
      } catch (_error) {
        // La pestaña podría estar navegando o aún no tener el content script.
      }
    }
  } catch (error) {
    console.warn("[DHL Keepalive] No se pudieron revisar las pestañas:", error);
  }
});
