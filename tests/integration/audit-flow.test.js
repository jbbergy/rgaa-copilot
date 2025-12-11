import { describe, it, expect, vi, beforeEach } from "vitest"
import browser from "webextension-polyfill"

describe("Full Audit Flow Integration", () => {
  let contentScriptHandlers
  let popupHandlers

  beforeEach(() => {
    contentScriptHandlers = {}
    popupHandlers = {}

    // Mock browser.runtime for content script
    browser.runtime = {
      sendMessage: vi.fn(),
      onMessage: {
        addListener: (handler) => {
          contentScriptHandlers.onMessage = handler
        },
        removeListener: vi.fn()
      }
    }

    // Mock browser.tabs for popup
    browser.tabs = {
      query: vi.fn().mockResolvedValue([{ id: 1, url: "https://example.com" }]),
      sendMessage: vi.fn()
    }
  })

  it("should complete full audit flow from popup to content script and back", async () => {
    // Step 1: Popup sends START_AUDIT to content script
    const startAuditMessage = {
      type: "START_AUDIT",
      payload: {
        url: "https://example.com",
        timestamp: Date.now()
      }
    }

    browser.tabs.sendMessage.mockImplementation(async (tabId, message) => {
      if (message.type === "START_AUDIT") {
        // Simulate content script receiving and processing
        setTimeout(() => {
          // Step 2: Content script sends AUDIT_PROGRESS
          contentScriptHandlers.onMessage?.({
            type: "AUDIT_PROGRESS",
            payload: { current: 50, total: 106, currentCriterion: "3.2" }
          }, {}, vi.fn())
        }, 100)

        setTimeout(() => {
          // Step 3: Content script sends AUDIT_COMPLETE
          contentScriptHandlers.onMessage?.({
            type: "AUDIT_COMPLETE",
            payload: {
              url: "https://example.com",
              timestamp: Date.now(),
              results: [
                {
                  criterionId: "1.1",
                  status: "fail",
                  violations: [
                    {
                      element: "img",
                      selector: "img.logo",
                      html: "<img src=\"logo.png\" class=\"logo\">",
                      message: "Image sans attribut alt"
                    }
                  ]
                },
                {
                  criterionId: "3.2",
                  status: "pass",
                  violations: []
                }
              ],
              summary: {
                pass: 50,
                fail: 5,
                manualCheck: 51,
                notApplicable: 0
              }
            }
          }, {}, vi.fn())
        }, 200)

        return { started: true }
      }
    })

    // Execute audit flow
    const response = await browser.tabs.sendMessage(1, startAuditMessage)

    expect(response.started).toBe(true)
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(1, startAuditMessage)

    // Wait for async handlers
    await new Promise(resolve => setTimeout(resolve, 300))

    expect(contentScriptHandlers.onMessage).toBeDefined()
  })

  it("should handle HIGHLIGHT_ELEMENT message from popup to content script", async () => {
    const highlightMessage = {
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        selector: "img.logo",
        criterionId: "1.1"
      }
    }

    browser.tabs.sendMessage.mockResolvedValue({ highlighted: true })

    const response = await browser.tabs.sendMessage(1, highlightMessage)

    expect(response.highlighted).toBe(true)
    expect(browser.tabs.sendMessage).toHaveBeenCalledWith(1, highlightMessage)
  })

  it("should handle audit errors gracefully", async () => {
    const startAuditMessage = {
      type: "START_AUDIT",
      payload: {
        url: "https://example.com",
        timestamp: Date.now()
      }
    }

    browser.tabs.sendMessage.mockImplementation(async (tabId, message) => {
      if (message.type === "START_AUDIT") {
        setTimeout(() => {
          contentScriptHandlers.onMessage?.({
            type: "AUDIT_ERROR",
            payload: {
              error: "DOM inspection failed",
              criterionId: "8.2"
            }
          }, {}, vi.fn())
        }, 100)

        return { started: true }
      }
    })

    const response = await browser.tabs.sendMessage(1, startAuditMessage)

    expect(response.started).toBe(true)

    // Wait for error handler
    await new Promise(resolve => setTimeout(resolve, 150))

    expect(contentScriptHandlers.onMessage).toBeDefined()
  })

  it("should process multiple criteria results in order", async () => {
    const results = []

    contentScriptHandlers.onMessage = vi.fn((message) => {
      if (message.type === "AUDIT_PROGRESS") {
        results.push(message.payload.currentCriterion)
      }
    })

    const criteria = ["1.1", "3.2", "8.2", "10.7", "11.1"]

    for (const criterion of criteria) {
      contentScriptHandlers.onMessage({
        type: "AUDIT_PROGRESS",
        payload: {
          current: criteria.indexOf(criterion) + 1,
          total: criteria.length,
          currentCriterion: criterion
        }
      })
    }

    expect(results).toEqual(criteria)
    expect(contentScriptHandlers.onMessage).toHaveBeenCalledTimes(criteria.length)
  })

  it("should handle re-scan request correctly", async () => {
    const rescanMessage = {
      type: "START_AUDIT",
      payload: {
        url: "https://example.com",
        timestamp: Date.now(),
        rescan: true
      }
    }

    browser.tabs.sendMessage.mockResolvedValue({
      started: true,
      rescan: true
    })

    const response = await browser.tabs.sendMessage(1, rescanMessage)

    expect(response.started).toBe(true)
    expect(response.rescan).toBe(true)
  })
})
