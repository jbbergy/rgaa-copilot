/**
 * Background Service Worker
 * Minimal implementation as per Constitution Principle IV (Minimal Permissions)
 */

import browser from "webextension-polyfill"

// Service worker keeps extension alive
console.log("RGAA Copilot service worker initialized")

// Handle extension installation
browser.runtime.onInstalled.addListener(details => {
  console.log("RGAA Copilot installed:", details.reason)
})
