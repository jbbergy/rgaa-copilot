/**
 * Iframe Detector
 * Identifies iframes and detects cross-origin restrictions
 */

/**
 * Get all iframes on the page
 */
export function getAllIframes() {
  return Array.from(document.querySelectorAll("iframe"))
}

/**
 * Check if an iframe is cross-origin
 */
export function isCrossOrigin(iframe) {
  try {
    // Try to access iframe's contentWindow
    // If cross-origin, this will throw
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    return doc === null
  } catch (error) {
    // SecurityError indicates cross-origin
    return true
  }
}

/**
 * Get auditable iframes (same-origin only)
 */
export function getAuditableIframes() {
  const iframes = getAllIframes()
  return iframes.filter(iframe => !isCrossOrigin(iframe))
}

/**
 * Get cross-origin iframes that cannot be audited
 */
export function getCrossOriginIframes() {
  const iframes = getAllIframes()
  return iframes.filter(iframe => isCrossOrigin(iframe))
}

/**
 * Get iframe source URLs
 */
export function getIframeInfo(iframe) {
  return {
    src: iframe.src || "(no src)",
    id: iframe.id || "(no id)",
    title: iframe.title || "(no title)",
    crossOrigin: isCrossOrigin(iframe)
  }
}

/**
 * Get summary of iframe situation on page
 */
export function getIframeSummary() {
  const all = getAllIframes()
  const auditable = getAuditableIframes()
  const crossOrigin = getCrossOriginIframes()

  return {
    total: all.length,
    auditable: auditable.length,
    crossOrigin: crossOrigin.length,
    crossOriginList: crossOrigin.map(getIframeInfo)
  }
}
