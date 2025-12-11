/**
 * RGAA Criterion 11.5: Fields of Same Nature Grouped
 * Checks if related form fields are grouped with fieldset
 */

import { getElementsByTypeDeep, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion115() {
  const violations = []

  // Check radio button groups
  const radios = getElementsByTypeDeep("input[type=\"radio\"]")
  const radioGroups = new Map()

  for (const radio of radios) {
    const name = radio.getAttribute("name")
    if (name) {
      if (!radioGroups.has(name)) {
        radioGroups.set(name, [])
      }
      radioGroups.get(name).push(radio)
    }
  }

  for (const [name, group] of radioGroups) {
    if (group.length > 1) {
      // Check if grouped in fieldset
      const firstRadio = group[0]
      const fieldset = firstRadio.closest("fieldset")

      if (!fieldset) {
        violations.push({
          element: getUniqueSelector(firstRadio),
          html: getElementHTML(firstRadio.parentElement || firstRadio),
          message: {
            fr: `Groupe de boutons radio "${name}" sans <fieldset>`,
            en: `Radio button group "${name}" without <fieldset>`
          },
          remediation: {
            fr: "Envelopper les boutons radio dans un <fieldset> avec <legend>",
            en: "Wrap radio buttons in <fieldset> with <legend>"
          }
        })
      }
    }
  }

  // Check checkbox groups (similar pattern)
  const checkboxes = getElementsByTypeDeep("input[type=\"checkbox\"]")
  const checkboxGroups = new Map()

  for (const checkbox of checkboxes) {
    const name = checkbox.getAttribute("name")
    if (name?.includes("[]") || name?.includes("group")) {
      if (!checkboxGroups.has(name)) {
        checkboxGroups.set(name, [])
      }
      checkboxGroups.get(name).push(checkbox)
    }
  }

  for (const [name, group] of checkboxGroups) {
    if (group.length > 1) {
      const firstCheckbox = group[0]
      const fieldset = firstCheckbox.closest("fieldset")

      if (!fieldset) {
        violations.push({
          element: getUniqueSelector(firstCheckbox),
          html: getElementHTML(firstCheckbox.parentElement || firstCheckbox),
          message: {
            fr: `Groupe de cases à cocher "${name}" sans <fieldset>`,
            en: `Checkbox group "${name}" without <fieldset>`
          },
          remediation: {
            fr: "Envelopper les cases à cocher dans un <fieldset> avec <legend>",
            en: "Wrap checkboxes in <fieldset> with <legend>"
          }
        })
      }
    }
  }

  return {
    criterionId: "11.5",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${radioGroups.size + checkboxGroups.size} groupe(s) analysé(s), ${violations.length} sans fieldset`,
      en: `${radioGroups.size + checkboxGroups.size} group(s) analyzed, ${violations.length} without fieldset`
    }
  }
}
