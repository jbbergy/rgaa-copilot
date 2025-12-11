/**
 * useAudit Composable
 * Manages audit state and communication with content script
 */

import { ref, computed } from "vue"
import { MessageTypes, sendToContentScript, onMessage } from "@/shared/utils/messaging.js"
import { saveAudit, loadAuditsForURL } from "@/shared/utils/storage.js"
import browser from "webextension-polyfill"

const auditState = ref(null)
const isAuditing = ref(false)
const progress = ref({ current: 0, total: 0 })
const error = ref(null)
const isInitialized = ref(false)
const activeFilters = ref(new Set())

// T234: Debounce utility
function debounce(fn, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}

// T239/T242: Screen reader announcement helper
function announceToScreenReader(message, priority = "polite") {
  const announcement = document.createElement("div")
  announcement.setAttribute("role", "status")
  announcement.setAttribute("aria-live", priority)
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => announcement.remove(), 1000)
}

export function useAudit() {
  // T239: Track last announced progress milestone
  let lastAnnouncedProgress = 0

  /**
   * Start a new audit
   */
  async function startAudit() {
    console.log("Starting audit from popup...")
    isAuditing.value = true
    error.value = null
    progress.value = { current: 0, total: 0 }
    lastAnnouncedProgress = 0

    try {
      const response = await sendToContentScript({
        type: MessageTypes.START_AUDIT
      })

      console.log("Received response:", response)
      console.log("Response type:", response?.type)
      console.log("Expected type:", MessageTypes.AUDIT_COMPLETE)

      // Check if response is undefined or null
      if (!response) {
        throw new Error("No response received from content script. Please refresh the page and try again.")
      }

      if (response.type === MessageTypes.AUDIT_COMPLETE) {
        console.log("Audit completed successfully, payload:", response.payload)
        auditState.value = response.payload

        // Save to history
        await saveAudit(response.payload)
        console.log("Audit saved to history")

        // T242: Announce completion to screen readers
        const summary = response.payload.summary
        announceToScreenReader(
          `Audit complete. ${summary.passed} passed, ${summary.failed} failed, ${summary.manualCheckRequired} require manual check.`,
          "polite"
        )
      } else if (response.type === "AUDIT_ERROR") {
        console.error("Audit error:", response.payload.message)
        error.value = response.payload.message
        // T240: Announce error to screen readers
        announceToScreenReader(`Audit error: ${response.payload.message}`, "assertive")
      } else if (response.type === "ERROR") {
        console.error("Message handler error:", response.error)
        error.value = response.error
        announceToScreenReader(`Audit error: ${response.error}`, "assertive")
      } else {
        error.value = "Unexpected response from content script"
        console.error("Invalid response:", response)
        announceToScreenReader("Audit error: Unexpected response from content script", "assertive")
      }
    } catch (err) {
      console.error("Audit failed:", err)
      console.error("Error details:", err.message, err.stack)
      error.value = err.message
      // T240: Announce error to screen readers
      announceToScreenReader(`Audit failed: ${err.message}`, "assertive")
    } finally {
      isAuditing.value = false
      console.log("Audit process finished, isAuditing:", isAuditing.value)
    }
  }

  /**
   * Load last audit from storage
   */
  async function loadLastAudit() {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      if (tabs[0]) {
        const audits = await loadAuditsForURL(tabs[0].url)
        if (audits && audits.length > 0) {
          auditState.value = audits[audits.length - 1].full || audits[audits.length - 1]
          console.log("Loaded last audit from storage", auditState.value)
        }
      }
    } catch (err) {
      console.error("Failed to load last audit:", err)
    }
  }

  /**
   * Initialize - load last audit if not already initialized
   */
  async function initialize() {
    if (!isInitialized.value && !auditState.value) {
      await loadLastAudit()
      isInitialized.value = true
    }
  }

  /**
   * Highlight an element on the page
   */
  async function highlightElement(selector) {
    try {
      await sendToContentScript({
        type: MessageTypes.HIGHLIGHT_ELEMENT,
        payload: { selector }
      })
    } catch (err) {
      console.error("Failed to highlight element:", err)
    }
  }

  /**
   * Listen for progress updates
   * T239: Announce progress milestones to screen readers (every 25%)
   */
  onMessage(message => {
    if (message.type === MessageTypes.AUDIT_PROGRESS) {
      progress.value = message.payload

      // T239: Announce progress at 25%, 50%, 75% milestones
      if (message.payload.total > 0) {
        const percent = Math.floor((message.payload.current / message.payload.total) * 100)
        const milestone = Math.floor(percent / 25) * 25

        if (milestone > lastAnnouncedProgress && milestone > 0 && milestone < 100) {
          lastAnnouncedProgress = milestone
          announceToScreenReader(`Audit ${milestone}% complete`, "polite")
        }
      }
    }
    // Don't keep channel open - this is a one-way message
    return false
  })

  /**
   * Toggle a status filter
   * T234: Debounced filter toggle (150ms)
   */
  const debouncedFilterUpdate = debounce((status, isAdding) => {
    if (isAdding) {
      activeFilters.value.add(status)
    } else {
      activeFilters.value.delete(status)
    }
    // Trigger reactivity
    activeFilters.value = new Set(activeFilters.value)

    // T241: Announce filter state changes to screen readers
    const filterName = status === "pass" ? "passed" : status === "fail" ? "failed" : "manual check"
    announceToScreenReader(
      `Filter by ${filterName}: ${isAdding ? "active" : "inactive"}`,
      "polite"
    )
  }, 150)

  function toggleFilter(status) {
    const isAdding = !activeFilters.value.has(status)
    // Immediate visual feedback
    if (isAdding) {
      activeFilters.value.add(status)
    } else {
      activeFilters.value.delete(status)
    }
    activeFilters.value = new Set(activeFilters.value)

    // Debounced announcement
    debouncedFilterUpdate(status, isAdding)
  }

  /**
   * Clear all filters
   */
  function clearFilters() {
    activeFilters.value = new Set()
  }

  // Computed properties
  const hasResults = computed(() => auditState.value !== null)
  const summary = computed(() => auditState.value?.summary || null)
  const criteriaResults = computed(() => auditState.value?.criteriaResults || [])
  const filteredCriteriaResults = computed(() => {
    const results = auditState.value?.criteriaResults || []
    if (activeFilters.value.size === 0) {
      return results
    }
    return results.filter(criterion => {
      if (activeFilters.value.has("pass") && criterion.status === "pass") return true
      if (activeFilters.value.has("fail") && criterion.status === "fail") return true
      if (activeFilters.value.has("manual") && criterion.status === "manual") return true
      return false
    })
  })
  const warnings = computed(() => auditState.value?.warnings || null)
  const auditResults = computed(() => auditState.value || null)

  return {
    auditState,
    auditResults,
    isAuditing,
    progress,
    error,
    hasResults,
    summary,
    criteriaResults,
    filteredCriteriaResults,
    activeFilters,
    warnings,
    startAudit,
    highlightElement,
    initialize,
    loadLastAudit,
    toggleFilter,
    clearFilters
  }
}
