/**
 * Content Script Entry Point
 * Injected into all pages for RGAA auditing
 */

import { runAudit } from "./auditor/engine.js"
import { MessageTypes, onMessage, sendToPopup } from "@/shared/utils/messaging.js"

console.log("RGAA Copilot content script loaded")

// Signal to diagnostic page that content script is loaded
if (typeof window !== "undefined") {
  window.rgaaAuditorLoaded = true
  window.dispatchEvent(new CustomEvent("rgaa-auditor-ready"))
}

// Store current highlight cleanup function
let currentHighlightCleanup = null

// Listen for audit requests from popup
onMessage(async (message, sender, sendResponse) => {
  console.log("Content script received message:", message.type)

  if (message.type === MessageTypes.START_AUDIT) {
    console.log("Starting audit...")

    try {
      // Run the audit with progress updates
      const result = await runAudit(progress => {
        sendToPopup({
          type: MessageTypes.AUDIT_PROGRESS,
          payload: progress
        }).catch(err => console.error("Failed to send progress:", err))
      })

      console.log("Audit completed, result:", result)

      // Return the response
      return {
        type: MessageTypes.AUDIT_COMPLETE,
        payload: result
      }
    } catch (error) {
      console.error("Audit failed:", error)
      return {
        type: "AUDIT_ERROR",
        payload: { message: error.message }
      }
    }
  }

  if (message.type === MessageTypes.HIGHLIGHT_ELEMENT) {
    try {
      // Clean up any existing highlight first
      if (currentHighlightCleanup) {
        currentHighlightCleanup()
        currentHighlightCleanup = null
      }

      const { selector } = message.payload
      const element = document.querySelector(selector)

      if (element) {
        // Function to detect scroll end
        const waitForScrollEnd = () => {
          return new Promise((resolve) => {
            let lastScrollTop = window.scrollY
            let lastScrollLeft = window.scrollX
            let scrollCheckCount = 0
            const maxChecks = 50 // Maximum 1 second (50 * 20ms)

            const checkScroll = () => {
              const currentScrollTop = window.scrollY
              const currentScrollLeft = window.scrollX

              if (currentScrollTop === lastScrollTop && currentScrollLeft === lastScrollLeft) {
                scrollCheckCount++
                if (scrollCheckCount >= 3) { // Stable for 60ms
                  resolve()
                  return
                }
              } else {
                scrollCheckCount = 0
                lastScrollTop = currentScrollTop
                lastScrollLeft = currentScrollLeft
              }

              if (scrollCheckCount < maxChecks) {
                setTimeout(checkScroll, 20)
              } else {
                resolve() // Timeout fallback
              }
            }

            setTimeout(checkScroll, 20)
          })
        }

        // Scroll into view
        element.scrollIntoView({ behavior: "smooth", block: "center" })

        // Wait for scroll to complete
        waitForScrollEnd().then(() => {
          const rect = element.getBoundingClientRect()
          const margin = 15 // Marge autour de l'élément

          // Add keyframe animation and overlay
          if (!document.getElementById("rgaa-highlight-styles")) {
            const style = document.createElement("style")
            style.id = "rgaa-highlight-styles"
            style.textContent = `
              @keyframes rgaa-pulse {
                0%, 100% { 
                  outline: 5px solid rgba(255, 215, 0, 0.9) !important;
                  outline-offset: 3px !important;
                  filter: brightness(1.4) contrast(1.1) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)) !important;
                }
                50% { 
                  outline: 8px solid rgba(255, 215, 0, 1) !important;
                  outline-offset: 6px !important;
                  filter: brightness(1.6) contrast(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 1)) !important;
                }
              }
              .rgaa-highlight-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(0, 0, 0, 0.75) !important;
                z-index: 2147483640 !important;
                pointer-events: none !important;
              }
              .rgaa-highlight-target {
                position: relative !important;
                animation: rgaa-pulse 1.5s ease-in-out infinite !important;
                z-index: 2147483641 !important;
              }
            `
            document.head.appendChild(style)
          }

          // Create dark overlay with cutout
          const overlay = document.createElement("div")
          overlay.className = "rgaa-highlight-overlay"
          overlay.id = "rgaa-highlight-overlay-temp"

          // Create clip-path to exclude the element area
          const clipPath = `polygon(
            0% 0%, 
            0% 100%, 
            ${rect.left - margin}px 100%, 
            ${rect.left - margin}px ${rect.top - margin}px, 
            ${rect.right + margin}px ${rect.top - margin}px, 
            ${rect.right + margin}px ${rect.bottom + margin}px, 
            ${rect.left - margin}px ${rect.bottom + margin}px, 
            ${rect.left - margin}px 100%, 
            100% 100%, 
            100% 0%
          )`

          overlay.style.clipPath = clipPath
          document.body.appendChild(overlay)

          // Store original styles
          const originalOutline = element.style.outline
          const originalOutlineOffset = element.style.outlineOffset
          const originalAnimation = element.style.animation
          const originalFilter = element.style.filter
          const originalZIndex = element.style.zIndex

          // Add highlight class and styles
          element.classList.add("rgaa-highlight-target")
          element.style.outline = "5px solid #FFD700"
          element.style.outlineOffset = "3px"

          // Create cleanup function
          const cleanup = () => {
            element.classList.remove("rgaa-highlight-target")
            element.style.outline = originalOutline
            element.style.outlineOffset = originalOutlineOffset
            element.style.animation = originalAnimation
            element.style.filter = originalFilter
            element.style.zIndex = originalZIndex
            if (overlay.parentNode) {
              overlay.remove()
            }
            if (currentHighlightCleanup === cleanup) {
              currentHighlightCleanup = null
            }
          }

          currentHighlightCleanup = cleanup

          // Remove highlight after 3 seconds
          setTimeout(() => {
            if (currentHighlightCleanup === cleanup) {
              cleanup()
            }
          }, 3000)
        })
      }

      return { success: true }
    } catch (error) {
      console.error("Failed to highlight element:", error)
      return { success: false, error: error.message }
    }
  }

  // Unknown message type
  console.warn("Unknown message type:", message.type)
  return { type: "ERROR", error: `Unknown message type: ${message.type}` }
})
