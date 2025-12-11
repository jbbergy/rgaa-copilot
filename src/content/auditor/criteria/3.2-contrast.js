/**
 * RGAA Criterion 3.2: Color Contrast
 * Checks if text has sufficient contrast with background (4.5:1 for normal text)
 */

import { queryAllDeep, isVisible, getComputedStyles, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

/**
 * Calculate relative luminance per WCAG formula
 */
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(...rgb1)
  const lum2 = getLuminance(...rgb2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Parse RGB color string to [r, g, b]
 */
function parseRGB(colorString) {
  const match = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return [0, 0, 0]
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
}

/**
 * Check if text is "large" (18pt+ or 14pt+ bold)
 */
function isLargeText(fontSize, fontWeight) {
  const size = parseFloat(fontSize)
  const weight = parseInt(fontWeight) || 400

  return size >= 24 || (size >= 18.5 && weight >= 700)
}

export async function checkCriterion32() {
  const violations = []

  // Get all text elements
  const textElements = queryAllDeep("p, h1, h2, h3, h4, h5, h6, span, div, a, button, li, td, th, label")
    .filter(el => isVisible(el) && el.textContent.trim().length > 0)

  for (const element of textElements) {
    const styles = getComputedStyles(element)
    const color = parseRGB(styles.color)
    const bgColor = parseRGB(styles.backgroundColor)
    const fontSize = styles.fontSize
    const fontWeight = styles.fontWeight

    // Skip if background is transparent (we'd need to check parent)
    if (styles.backgroundColor === "rgba(0, 0, 0, 0)") {
      continue
    }

    const contrast = getContrastRatio(color, bgColor)
    const large = isLargeText(fontSize, fontWeight)
    const requiredContrast = large ? 3 : 4.5

    if (contrast < requiredContrast) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: `Contraste insuffisant: ${contrast.toFixed(2)}:1 (minimum requis: ${requiredContrast}:1)`,
          en: `Insufficient contrast: ${contrast.toFixed(2)}:1 (minimum required: ${requiredContrast}:1)`
        },
        remediation: {
          fr: "Ajuster les couleurs pour atteindre un ratio de contraste de 4.5:1 minimum (3:1 pour le texte de grande taille)",
          en: "Adjust colors to achieve a minimum contrast ratio of 4.5:1 (3:1 for large text)"
        }
      })
    }
  }

  return {
    criterionId: "3.2",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${textElements.length} élément(s) de texte analysé(s), ${violations.length} violation(s) détectée(s)`,
      en: `${textElements.length} text element(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
