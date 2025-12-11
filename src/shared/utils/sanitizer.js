/**
 * HTML Sanitizer
 * Safely sanitizes HTML content for display in the popup
 * Prevents XSS attacks when displaying page content
 */

const ALLOWED_TAGS = ["b", "i", "em", "strong", "code", "pre", "span"]
const ALLOWED_ATTRS = ["class"]

/**
 * Sanitize HTML string by removing potentially dangerous content
 */
export function sanitizeHTML(html) {
  if (!html) return ""

  // Create a temporary div to parse HTML
  const temp = document.createElement("div")
  temp.innerHTML = html

  // Remove all script tags
  const scripts = temp.querySelectorAll("script")
  scripts.forEach(script => script.remove())

  // Remove all event handlers
  const allElements = temp.querySelectorAll("*")
  allElements.forEach(el => {
    // Remove event handler attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name)
      }
      // Remove non-allowed attributes
      if (!ALLOWED_ATTRS.includes(attr.name) && attr.name !== "style") {
        el.removeAttribute(attr.name)
      }
    })

    // Remove elements not in allowed list
    if (!ALLOWED_TAGS.includes(el.tagName.toLowerCase())) {
      // Replace with text content
      const textNode = document.createTextNode(el.textContent)
      el.replaceWith(textNode)
    }
  })

  return temp.innerHTML
}

/**
 * Escape HTML entities
 */
export function escapeHTML(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

/**
 * Truncate HTML string to max length
 */
export function truncateHTML(html, maxLength = 200) {
  const text = stripHTML(html)
  if (text.length <= maxLength) return html

  return escapeHTML(text.substring(0, maxLength) + "...")
}

/**
 * Strip all HTML tags
 */
export function stripHTML(html) {
  const temp = document.createElement("div")
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ""
}
