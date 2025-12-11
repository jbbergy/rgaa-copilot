/**
 * RGAA Criterion 10.7: Focus Visible
 * Checks if interactive elements have visible focus indicators
 */

import { queryAllDeep, isVisible, getComputedStyles, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

/**
 * Check if element has a visible focus indicator
 */
function hasFocusIndicator(element) {
  const styles = getComputedStyles(element)

  // Check outline
  const outlineWidth = parseFloat(styles.outlineWidth) || 0
  const outlineStyle = styles.outlineStyle
  const outlineColor = styles.outlineColor

  if (outlineStyle !== "none" && outlineWidth >= 1 && outlineColor !== "transparent") {
    return true
  }

  // Check border changes (some sites use border instead of outline)
  const borderWidth = parseFloat(styles.borderWidth) || 0
  const borderStyle = styles.borderStyle
  const borderColor = styles.borderColor

  if (borderStyle !== "none" && borderWidth >= 1 && borderColor !== "transparent") {
    return true
  }

  // Check box-shadow (some sites use this for focus)
  const boxShadow = styles.boxShadow
  if (boxShadow && boxShadow !== "none") {
    return true
  }

  return false
}

export async function checkCriterion107() {
  const violations = []

  // Get all interactive elements
  const interactiveSelectors = [
    "a[href]",
    "button",
    "input:not([type='hidden'])",
    "select",
    "textarea",
    "[tabindex]:not([tabindex='-1'])",
    "[role='button']",
    "[role='link']"
  ]

  const interactiveElements = interactiveSelectors
    .flatMap(selector => queryAllDeep(selector))
    .filter(el => isVisible(el))

  for (const element of interactiveElements) {
    // Temporarily focus element to check its focus styles
    const originalTabIndex = element.tabIndex
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1")
    }

    element.focus()
    const hasFocus = hasFocusIndicator(element)
    element.blur()

    // Restore original tabindex
    if (originalTabIndex === -1 && !element.hasAttribute("tabindex")) {
      element.removeAttribute("tabindex")
    }

    if (!hasFocus) {
      violations.push({
        element: getUniqueSelector(element),
        html: getElementHTML(element),
        message: {
          fr: "Indicateur de focus non visible ou insuffisant",
          en: "Focus indicator not visible or insufficient"
        },
        remediation: {
          fr: "Ajouter un outline ou border visible lors du focus (minimum 2px)",
          en: "Add a visible outline or border on focus (minimum 2px)"
        }
      })
    }
  }

  return {
    criterionId: "10.7",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${interactiveElements.length} élément(s) interactif(s) analysé(s), ${violations.length} violation(s) détectée(s)`,
      en: `${interactiveElements.length} interactive element(s) analyzed, ${violations.length} violation(s) detected`
    }
  }
}
