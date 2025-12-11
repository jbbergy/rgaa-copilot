/**
 * Messaging Protocol
 * Handles communication between content scripts and popup
 * 
 * Message Types:
 * - START_AUDIT: Request to start an audit
 * - AUDIT_PROGRESS: Progress update during audit
 * - AUDIT_COMPLETE: Audit finished with results
 * - HIGHLIGHT_ELEMENT: Request to highlight an element on the page
 */

import browser from "webextension-polyfill"

export const MessageTypes = {
  START_AUDIT: "START_AUDIT",
  AUDIT_PROGRESS: "AUDIT_PROGRESS",
  AUDIT_COMPLETE: "AUDIT_COMPLETE",
  HIGHLIGHT_ELEMENT: "HIGHLIGHT_ELEMENT",
  CLEAR_HIGHLIGHTS: "CLEAR_HIGHLIGHTS"
}

/**
 * Send a message to the active tab's content script
 */
export async function sendToContentScript(message) {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    if (tabs.length === 0) {
      throw new Error("No active tab found")
    }

    const tab = tabs[0]
    console.log("Sending message to tab:", tab.id, tab.url, message.type)

    // Check if the URL is supported
    if (!tab.url ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("about:") ||
      tab.url.startsWith("edge://") ||
      tab.url.startsWith("moz-extension://")) {
      throw new Error("Cannot audit this page. Please open a regular webpage (http:// or https://)")
    }

    const response = await browser.tabs.sendMessage(tab.id, message)
    console.log("Received response from tab:", response)
    return response
  } catch (error) {
    console.error("Failed to send message to content script:", error)

    // Provide better error messages
    if (error.message.includes("Could not establish connection") ||
      error.message.includes("Receiving end does not exist")) {
      throw new Error("Content script not loaded. Please refresh the page (F5) and try again.")
    }

    throw error
  }
}

/**
 * Send a message to the popup
 */
export async function sendToPopup(message) {
  try {
    const response = await browser.runtime.sendMessage(message)
    return response
  } catch (error) {
    console.error("Failed to send message to popup:", error)
    throw error
  }
}

/**
 * Listen for messages
 */
export function onMessage(callback) {
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Wrap callback to handle both sync and async responses
    const result = callback(message, sender, sendResponse)

    // If callback returns a promise, handle it
    if (result instanceof Promise) {
      result
        .then(response => {
          sendResponse(response)
        })
        .catch(error => {
          console.error("Error in message handler:", error)
          sendResponse({ type: "ERROR", error: error.message })
        })
      return true // Keep channel open for async response
    }

    // If callback returns true, it will handle sendResponse itself
    if (result === true) {
      return true
    }

    // Otherwise, channel closes immediately
    return false
  })
}
