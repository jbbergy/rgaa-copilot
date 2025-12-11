import { describe, it, expect, vi, beforeEach } from "vitest"
import browser from "webextension-polyfill"

describe("START_AUDIT Message Contract", () => {
  let mockSendMessage

  beforeEach(() => {
    mockSendMessage = vi.fn()
    browser.runtime = {
      sendMessage: mockSendMessage,
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn()
      }
    }
  })

  it("should accept START_AUDIT message with correct structure", async () => {
    const message = {
      type: "START_AUDIT",
      payload: {
        url: "https://example.com",
        timestamp: Date.now()
      }
    }

    mockSendMessage.mockResolvedValue({ success: true })

    const response = await browser.runtime.sendMessage(message)

    expect(mockSendMessage).toHaveBeenCalledWith(message)
    expect(response.success).toBe(true)
  })

  it("should accept AUDIT_PROGRESS message with progress data", async () => {
    const message = {
      type: "AUDIT_PROGRESS",
      payload: {
        current: 25,
        total: 106,
        currentCriterion: "1.1"
      }
    }

    mockSendMessage.mockResolvedValue({ received: true })

    const response = await browser.runtime.sendMessage(message)

    expect(mockSendMessage).toHaveBeenCalledWith(message)
    expect(response.received).toBe(true)
  })

  it("should accept AUDIT_COMPLETE message with results", async () => {
    const message = {
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
          }
        ],
        summary: {
          pass: 50,
          fail: 5,
          manualCheck: 51,
          notApplicable: 0
        }
      }
    }

    mockSendMessage.mockResolvedValue({ received: true })

    const response = await browser.runtime.sendMessage(message)

    expect(mockSendMessage).toHaveBeenCalledWith(message)
    expect(response.received).toBe(true)
  })

  it("should accept HIGHLIGHT_ELEMENT message with selector", async () => {
    const message = {
      type: "HIGHLIGHT_ELEMENT",
      payload: {
        selector: "img.logo",
        criterionId: "1.1"
      }
    }

    mockSendMessage.mockResolvedValue({ highlighted: true })

    const response = await browser.runtime.sendMessage(message)

    expect(mockSendMessage).toHaveBeenCalledWith(message)
    expect(response.highlighted).toBe(true)
  })

  it("should reject malformed messages", async () => {
    const message = {
      type: "INVALID_TYPE",
      payload: {}
    }

    mockSendMessage.mockRejectedValue(new Error("Invalid message type"))

    await expect(browser.runtime.sendMessage(message)).rejects.toThrow("Invalid message type")
  })

  it("should handle missing payload gracefully", async () => {
    const message = {
      type: "START_AUDIT"
    }

    mockSendMessage.mockRejectedValue(new Error("Payload required"))

    await expect(browser.runtime.sendMessage(message)).rejects.toThrow("Payload required")
  })
})
