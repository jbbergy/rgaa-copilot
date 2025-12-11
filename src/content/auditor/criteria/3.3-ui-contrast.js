/**
 * RGAA Criterion 3.3: Sufficient UI Component Contrast
 * Checks contrast ratios for interactive UI components (3:1 minimum)
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion33() {
  const violations = []

  // Focus on interactive components
  const components = [
    ...getElementsByTypeDeep("button"),
    ...getElementsByTypeDeep("input"),
    ...getElementsByTypeDeep("select"),
    ...getElementsByTypeDeep("textarea"),
    ...getElementsByTypeDeep("a")
  ].filter(isVisible)

  const getContrastRatio = (color1, color2) => {
    // Simplified contrast calculation
    const getLuminance = (rgb) => {
      const [r, g, b] = rgb.match(/\d+/g).map(Number)
      const rsRGB = r / 255
      const gsRGB = g / 255
      const bsRGB = b / 255

      const r2 = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4)
      const g2 = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4)
      const b2 = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4)

      return 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2
    }

    const l1 = getLuminance(color1)
    const l2 = getLuminance(color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  for (const component of components) {
    try {
      const computedStyle = window.getComputedStyle(component)
      const color = computedStyle.color
      const backgroundColor = computedStyle.backgroundColor
      const borderColor = computedStyle.borderColor

      // Check if component has visible border or background
      const hasBorder = computedStyle.borderWidth !== "0px"
      const hasBackground = backgroundColor !== "rgba(0, 0, 0, 0)" && backgroundColor !== "transparent"

      if (hasBorder && borderColor && backgroundColor) {
        const contrast = getContrastRatio(borderColor, backgroundColor)
        if (contrast < 3) {
          violations.push({
            element: getUniqueSelector(component),
            html: getElementHTML(component),
            message: {
              fr: `Contraste insuffisant pour composant UI: ${contrast.toFixed(2)}:1 (minimum 3:1)`,
              en: `Insufficient UI component contrast: ${contrast.toFixed(2)}:1 (minimum 3:1)`
            },
            remediation: {
              fr: "Augmenter le contraste entre la bordure et l'arrière-plan à au moins 3:1",
              en: "Increase contrast between border and background to at least 3:1"
            }
          })
        }
      }
    } catch (e) {
      // Skip elements where contrast can't be calculated
    }
  }

  return {
    criterionId: "3.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${components.length} composant(s) UI analysé(s), ${violations.length} violation(s) détectée(s)`,
      en: `${components.length} UI component(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
