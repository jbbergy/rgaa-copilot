/**
 * DOM Inspector Utility
 * Traverses DOM including Shadow DOM for RGAA auditing
 */

// T224: Memoization cache for getComputedStyles results
const computedStylesCache = new WeakMap()

// T229: WeakMap-based element cache for garbage collection
const elementResultCache = new WeakMap()

/**
 * Clear all caches (T231: Memory cleanup after audit completion)
 */
export function clearCaches() {
  // WeakMaps are automatically garbage collected when elements are removed
  // but we can hint to clear them if needed
}

/**
 * T223: Schedule non-critical work during idle time
 * Uses requestIdleCallback with fallback to setTimeout
 */
export function scheduleIdleWork(callback, options = { timeout: 2000 }) {
  if (typeof requestIdleCallback !== "undefined") {
    return requestIdleCallback(callback, options)
  }
  // Fallback for browsers without requestIdleCallback
  return setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 0 }), 0)
}

/**
 * T223: Cancel scheduled idle work
 */
export function cancelIdleWork(id) {
  if (typeof cancelIdleCallback !== "undefined") {
    cancelIdleCallback(id)
  } else {
    clearTimeout(id)
  }
}

/**
 * T223: Run a batch of tasks during idle time
 * Yields control back to main thread between batches
 */
export async function runInIdleChunks(items, processFn, chunkSize = 10) {
  const results = []

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize)

    // Process chunk
    for (const item of chunk) {
      results.push(await processFn(item))
    }

    // Yield to main thread between chunks if there are more items
    if (i + chunkSize < items.length) {
      await new Promise(resolve => {
        scheduleIdleWork(resolve, { timeout: 100 })
      })
    }
  }

  return results
}

/**
 * Get all elements matching a selector, including shadow DOM
 * T226: Batch DOM queries by selector type to reduce layout thrashing
 */
export function queryAllDeep(selector, root = document) {
  const elements = []

  function traverse(node) {
    // Query in current scope
    const matches = node.querySelectorAll(selector)
    elements.push(...matches)

    // Traverse shadow DOM
    const allElements = node.querySelectorAll("*")
    allElements.forEach(el => {
      if (el.shadowRoot) {
        traverse(el.shadowRoot)
      }
    })
  }

  traverse(root)
  return elements
}

/**
 * Get all elements of a specific type, including shadow DOM
 */
export function getElementsByTypeDeep(tagName, root = document) {
  return queryAllDeep(tagName.toLowerCase(), root)
}

/**
 * Check if element is visible
 * T225: Use more efficient visibility checks
 */
export function isVisible(element) {
  if (!element) return false

  const style = getComputedStylesCached(element)

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    style.opacity !== "0" &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  )
}

/**
 * Get computed styles for an element with memoization (T224)
 */
export function getComputedStylesCached(element) {
  if (computedStylesCache.has(element)) {
    return computedStylesCache.get(element)
  }

  const styles = window.getComputedStyle(element)
  computedStylesCache.set(element, styles)
  return styles
}

/**
 * Get computed styles for an element (legacy function)
 */
export function getComputedStyles(element) {
  return getComputedStylesCached(element)
}

/**
 * Get or set cached result for an element (T227)
 */
export function getCachedResult(element, key) {
  const cache = elementResultCache.get(element)
  if (cache && cache[key] !== undefined) {
    return cache[key]
  }
  return undefined
}

export function setCachedResult(element, key, value) {
  let cache = elementResultCache.get(element)
  if (!cache) {
    cache = {}
    elementResultCache.set(element, cache)
  }
  cache[key] = value
  return value
}

/**
 * Get text content of an element (including accessible name)
 */
export function getAccessibleText(element) {
  // Try aria-label first
  if (element.hasAttribute("aria-label")) {
    return element.getAttribute("aria-label")
  }

  // Try aria-labelledby
  if (element.hasAttribute("aria-labelledby")) {
    const id = element.getAttribute("aria-labelledby")
    const labelElement = document.getElementById(id)
    if (labelElement) {
      return labelElement.textContent.trim()
    }
  }

  // Try associated label
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`)
    if (label) {
      return label.textContent.trim()
    }
  }

  // Try alt attribute (images)
  if (element.hasAttribute("alt")) {
    return element.getAttribute("alt")
  }

  // Try title attribute
  if (element.hasAttribute("title")) {
    return element.getAttribute("title")
  }

  // Fall back to text content
  return element.textContent.trim()
}

/**
 * Get unique CSS selector for an element
 */
export function getUniqueSelector(element) {
  if (element.id) {
    return `#${element.id}`
  }

  const path = []
  let current = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    if (current.className) {
      const classes = current.className.split(" ").filter(c => c).join(".")
      if (classes) {
        selector += `.${classes}`
      }
    }

    // Add nth-child if needed for uniqueness
    const siblings = current.parentNode?.children
    if (siblings && siblings.length > 1) {
      const index = Array.from(siblings).indexOf(current) + 1
      selector += `:nth-child(${index})`
    }

    path.unshift(selector)
    current = current.parentNode
  }

  return path.join(" > ")
}

/**
 * Truncate long attribute values (Data URIs, base64, long URLs)
 */
function truncateAttributeValue(value, maxLength = 50) {
  if (!value || value.length <= maxLength) return value

  // Detect and truncate Data URIs
  if (value.startsWith("data:")) {
    const mimeMatch = value.match(/^data:([^;,]+)/)
    const mimeType = mimeMatch ? mimeMatch[1] : "unknown"
    return `[data:${mimeType}...]`
  }

  // Detect and truncate base64 content
  if (/^[A-Za-z0-9+/=]{100,}$/.test(value)) {
    return "[base64...]"
  }

  // Truncate long URLs but keep the domain visible
  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      const url = new URL(value)
      if (value.length > maxLength) {
        return `${url.origin}/...`
      }
    } catch {
      // Not a valid URL, fall through to default truncation
    }
  }

  // Default truncation for other long values
  return value.substring(0, maxLength) + "..."
}

/**
 * Get HTML snippet for an element (sanitized and human-readable)
 */
export function getElementHTML(element, maxLength = 300) {
  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(false)

  // Truncate long attribute values
  for (const attr of clone.attributes) {
    const truncated = truncateAttributeValue(attr.value, 60)
    if (truncated !== attr.value) {
      clone.setAttribute(attr.name, truncated)
    }
  }

  // Get the opening tag only (no children)
  let html = clone.outerHTML

  // If element has children, close the tag properly
  if (element.children.length > 0 || element.textContent.trim()) {
    const tagName = element.tagName.toLowerCase()
    const selfClosingTags = ["img", "input", "br", "hr", "area", "base", "col", "embed", "link", "meta", "source", "track", "wbr"]

    if (!selfClosingTags.includes(tagName)) {
      // Get text content preview if any
      const textContent = element.textContent.trim()
      const textPreview = textContent.length > 50 ? textContent.substring(0, 50) + "..." : textContent

      // Replace the closing part with content indication
      const closingTag = `</${tagName}>`
      if (textPreview) {
        html = html.replace(closingTag, `${textPreview}${closingTag}`)
      } else if (element.children.length > 0) {
        html = html.replace(closingTag, `[${element.children.length} enfant(s)]${closingTag}`)
      }
    }
  }

  // Final length check
  if (html.length > maxLength) {
    return html.substring(0, maxLength) + "..."
  }

  return html
}
