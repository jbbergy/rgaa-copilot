/**
 * Storage Composable
 * Provides reactive access to audit history with differential storage
 */

import { ref, computed } from "vue"
import browser from "webextension-polyfill"
import {
  saveAudit,
  loadHistory,
  loadAuditsForURL,
  clearHistory,
  clearHistoryForURL,
  reconstructAudit,
  getStorageInfo
} from "../../shared/utils/storage.js"

const auditHistory = ref({})
const currentURL = ref("")
const isLoading = ref(false)
const error = ref(null)
const storageInfo = ref(null)

export function useStorage() {
  /**
   * Load all audit history
   */
  const loadAllHistory = async () => {
    isLoading.value = true
    error.value = null
    try {
      auditHistory.value = await loadHistory()
      return auditHistory.value
    } catch (err) {
      error.value = err.message
      console.error("Failed to load history:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load audits for a specific URL
   */
  const loadURLHistory = async (url) => {
    isLoading.value = true
    error.value = null
    currentURL.value = url
    try {
      const audits = await loadAuditsForURL(url)
      return audits
    } catch (err) {
      error.value = err.message
      console.error("Failed to load URL history:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Save a new audit result
   */
  const saveNewAudit = async (auditResult) => {
    isLoading.value = true
    error.value = null
    try {
      await saveAudit(auditResult)
      // Reload history after save
      await loadAllHistory()
    } catch (err) {
      error.value = err.message
      console.error("Failed to save audit:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete a specific audit from history
   */
  const deleteAudit = async (url, timestamp) => {
    isLoading.value = true
    error.value = null
    try {
      const history = auditHistory.value
      if (!history[url]) return

      const audits = history[url]
      const index = audits.findIndex(a => a.timestamp === timestamp)

      if (index === -1) return

      // If deleting a full audit, reconstruct next audit as full
      if (audits[index].full && index < audits.length - 1) {
        const reconstructed = reconstructAudit(audits, index + 1)
        audits[index + 1] = {
          ...audits[index + 1],
          full: reconstructed,
          delta: null
        }
      }

      audits.splice(index, 1)

      // If no audits left for this URL, delete the URL entry
      if (audits.length === 0) {
        await clearHistoryForURL(url)
      } else {
        // Save updated history
        await browser.storage.local.set({ rgaa_audit_history: history })
      }

      await loadAllHistory()
    } catch (err) {
      error.value = err.message
      console.error("Failed to delete audit:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear all history
   */
  const clearAllHistory = async () => {
    isLoading.value = true
    error.value = null
    try {
      await clearHistory()
      auditHistory.value = {}
    } catch (err) {
      error.value = err.message
      console.error("Failed to clear history:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Clear history for a specific URL
   */
  const clearURLHistory = async (url) => {
    isLoading.value = true
    error.value = null
    try {
      await clearHistoryForURL(url)
      delete auditHistory.value[url]
    } catch (err) {
      error.value = err.message
      console.error("Failed to clear URL history:", err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get all URLs with audit history
   */
  const urls = computed(() => {
    return Object.keys(auditHistory.value).sort()
  })

  /**
   * Get audit count for current URL
   */
  const currentURLAuditCount = computed(() => {
    if (!currentURL.value || !auditHistory.value[currentURL.value]) {
      return 0
    }
    return auditHistory.value[currentURL.value].length
  })

  /**
   * Get total audit count across all URLs
   */
  const totalAuditCount = computed(() => {
    return Object.values(auditHistory.value).reduce(
      (sum, audits) => sum + audits.length,
      0
    )
  })

  /**
   * Get most recent audit for each URL
   */
  const recentAudits = computed(() => {
    return Object.entries(auditHistory.value).map(([url, audits]) => {
      const latest = audits[audits.length - 1]
      return {
        url,
        timestamp: latest.timestamp,
        auditCount: audits.length
      }
    }).sort((a, b) => b.timestamp - a.timestamp)
  })

  /**
   * Get storage quota information
   */
  const loadStorageInfo = async () => {
    try {
      storageInfo.value = await getStorageInfo()
      return storageInfo.value
    } catch (err) {
      console.error("Failed to load storage info:", err)
      return null
    }
  }

  /**
   * Check if storage quota warning should be shown
   */
  const showQuotaWarning = computed(() => {
    return storageInfo.value?.warning || false
  })

  /**
   * Get formatted storage usage percentage
   */
  const storageUsagePercent = computed(() => {
    if (!storageInfo.value) return 0
    return Math.round(storageInfo.value.percentUsed * 100)
  })

  return {
    // State
    auditHistory,
    currentURL,
    isLoading,
    error,
    storageInfo,

    // Computed
    urls,
    currentURLAuditCount,
    totalAuditCount,
    recentAudits,
    showQuotaWarning,
    storageUsagePercent,

    // Methods
    loadAllHistory,
    loadURLHistory,
    saveNewAudit,
    deleteAudit,
    clearAllHistory,
    clearURLHistory,
    loadStorageInfo
  }
}
