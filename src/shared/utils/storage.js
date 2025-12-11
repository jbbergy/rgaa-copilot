/**
 * Differential Storage Engine
 * Uses JSON Patch (RFC 6902) for efficient audit history storage
 * Stores full baseline + deltas for same-URL audits
 */

import browser from "webextension-polyfill"
import { computeDelta, applyDelta } from "./diff-engine.js"

const STORAGE_KEY = "rgaa_audit_history"
const MAX_AUDITS_PER_URL = 10
const STORAGE_QUOTA_WARNING = 0.8 // Warn at 80%

export { computeDelta, applyDelta }

/**
 * Save an audit result
 * If an audit exists for the same URL, stores only the delta
 */
export async function saveAudit(auditResult) {
  try {
    const history = await loadHistory()
    const url = auditResult.pageUrl

    // Check storage quota before saving
    const quotaPercent = await checkStorageQuota()
    if (quotaPercent >= 0.9) {
      // Storage almost full - cleanup old audits
      await cleanupOldAudits(history)
    }

    // Check if we have a previous audit for this URL
    const existingAudits = history[url] || []

    if (existingAudits.length === 0) {
      // First audit for this URL - store full result
      history[url] = [{
        timestamp: Date.now(),
        full: auditResult,
        delta: null
      }]
    } else {
      // Compute delta from previous audit
      const previousAudit = existingAudits[existingAudits.length - 1]
      const baselineAudit = previousAudit.full || reconstructAudit(existingAudits, 0)
      const delta = computeDelta(baselineAudit, auditResult)

      existingAudits.push({
        timestamp: Date.now(),
        full: null,
        delta
      })

      // Limit history per URL
      if (existingAudits.length > MAX_AUDITS_PER_URL) {
        // Reconstruct full audit from deltas, make it the new baseline
        const newBaseline = reconstructAudit(existingAudits, existingAudits.length - MAX_AUDITS_PER_URL)
        existingAudits.splice(0, existingAudits.length - MAX_AUDITS_PER_URL)
        existingAudits[0] = {
          ...existingAudits[0],
          full: newBaseline,
          delta: null
        }
      }

      history[url] = existingAudits
    }

    await browser.storage.local.set({ [STORAGE_KEY]: history })

    // Check storage quota and warn if needed
    const finalQuota = await checkStorageQuota()
    if (finalQuota >= STORAGE_QUOTA_WARNING) {
      return { success: true, quotaWarning: finalQuota }
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to save audit:", error)
    throw error
  }
}

/**
 * Load all audit history
 */
export async function loadHistory() {
  try {
    const result = await browser.storage.local.get(STORAGE_KEY)
    return result[STORAGE_KEY] || {}
  } catch (error) {
    console.error("Failed to load history:", error)
    return {}
  }
}

/**
 * Load audits for a specific URL
 */
export async function loadAuditsForURL(url) {
  const history = await loadHistory()
  const audits = history[url] || []

  // Reconstruct full audits from deltas
  return audits.map((entry, index) => {
    if (entry.full) {
      return { ...entry.full, timestamp: entry.timestamp }
    }
    return {
      ...reconstructAudit(audits, index),
      timestamp: entry.timestamp
    }
  })
}

/**
 * Reconstruct full audit from baseline + deltas using JSON Patch
 */
export function reconstructAudit(auditHistory, targetIndex) {
  // Find the last full audit before target
  let baselineIndex = targetIndex
  while (baselineIndex >= 0 && !auditHistory[baselineIndex].full) {
    baselineIndex--
  }

  if (baselineIndex < 0) {
    throw new Error("No baseline audit found")
  }

  let reconstructed = { ...auditHistory[baselineIndex].full }

  // Apply deltas up to target
  for (let i = baselineIndex + 1; i <= targetIndex; i++) {
    const delta = auditHistory[i].delta
    if (delta && delta.length > 0) {
      reconstructed = applyDelta(reconstructed, delta)
    }
  }

  return reconstructed
}

/**
 * Clear all audit history
 */
export async function clearHistory() {
  await browser.storage.local.remove(STORAGE_KEY)
}

/**
 * Clear history for a specific URL
 */
export async function clearHistoryForURL(url) {
  const history = await loadHistory()
  delete history[url]
  await browser.storage.local.set({ [STORAGE_KEY]: history })
}

/**
 * Check storage quota and warn if approaching limit
 */
export async function checkStorageQuota() {
  if (browser.storage.local.getBytesInUse) {
    const bytesInUse = await browser.storage.local.getBytesInUse(STORAGE_KEY)
    const quota = browser.storage.local.QUOTA_BYTES || 5242880 // 5MB default
    const percentUsed = bytesInUse / quota

    if (percentUsed >= STORAGE_QUOTA_WARNING) {
      console.warn(`Storage quota at ${Math.round(percentUsed * 100)}%`)
    }

    return percentUsed
  }
  return 0
}

/**
 * Get storage quota information
 */
export async function getStorageInfo() {
  if (browser.storage.local.getBytesInUse) {
    const bytesInUse = await browser.storage.local.getBytesInUse(STORAGE_KEY)
    const quota = browser.storage.local.QUOTA_BYTES || 5242880 // 5MB default
    const percentUsed = bytesInUse / quota

    return {
      bytesInUse,
      quota,
      percentUsed,
      available: quota - bytesInUse,
      warning: percentUsed >= STORAGE_QUOTA_WARNING
    }
  }
  return null
}

/**
 * Cleanup old audits when approaching storage limit
 * Removes oldest audits first, maintaining at least 3 audits per URL
 */
async function cleanupOldAudits(history) {
  const MIN_AUDITS_PER_URL = 3

  // Get all URLs sorted by oldest audit timestamp
  const urlsWithTimestamps = Object.entries(history).map(([url, audits]) => ({
    url,
    oldestTimestamp: audits[0]?.timestamp || 0,
    auditCount: audits.length
  })).sort((a, b) => a.oldestTimestamp - b.oldestTimestamp)

  // Remove oldest audits until we free up enough space
  for (const { url, auditCount } of urlsWithTimestamps) {
    if (auditCount > MIN_AUDITS_PER_URL) {
      // Remove oldest audit for this URL
      const audits = history[url]
      const removed = audits.shift()

      // If we removed a full audit, make the next audit full
      if (removed.full && audits.length > 0) {
        audits[0] = {
          ...audits[0],
          full: reconstructAudit([removed, ...audits], 1),
          delta: null
        }
      }

      console.log(`Cleaned up oldest audit for ${url}`)

      // Check if we freed enough space
      const quotaPercent = await checkStorageQuota()
      if (quotaPercent < 0.85) {
        break
      }
    }
  }

  // Save cleaned history
  await browser.storage.local.set({ [STORAGE_KEY]: history })
}
