/**
 * RGAA Criterion 9.3: Lists Correctly Structured
 * Checks if lists use proper ul/ol/li markup
 */

import { getElementsByTypeDeep, isVisible, getUniqueSelector, getElementHTML } from "../dom-inspector.js"

export async function checkCriterion93() {
  const violations = []

  // Check list structure
  const lists = [...getElementsByTypeDeep("ul, ol, dl")].filter(isVisible)

  for (const list of lists) {
    const tagName = list.tagName.toLowerCase()

    if (tagName === "ul" || tagName === "ol") {
      // Check that direct children are li elements
      for (const child of list.children) {
        if (child.tagName.toLowerCase() !== "li") {
          violations.push({
            element: getUniqueSelector(list),
            html: getElementHTML(list),
            message: {
              fr: `Liste <${tagName}> contient un enfant non-<li>: <${child.tagName.toLowerCase()}>`,
              en: `List <${tagName}> contains non-<li> child: <${child.tagName.toLowerCase()}>`
            },
            remediation: {
              fr: "Les enfants directs de <ul>/<ol> doivent être des <li>",
              en: "Direct children of <ul>/<ol> must be <li> elements"
            }
          })
          break
        }
      }
    } else if (tagName === "dl") {
      // Check that children are dt/dd
      for (const child of list.children) {
        const childTag = child.tagName.toLowerCase()
        if (childTag !== "dt" && childTag !== "dd") {
          violations.push({
            element: getUniqueSelector(list),
            html: getElementHTML(list),
            message: {
              fr: `Liste <dl> contient un enfant invalide: <${childTag}>`,
              en: `List <dl> contains invalid child: <${childTag}>`
            },
            remediation: {
              fr: "Les enfants de <dl> doivent être <dt> et <dd>",
              en: "Children of <dl> must be <dt> and <dd> elements"
            }
          })
          break
        }
      }
    }
  }

  return {
    criterionId: "9.3",
    status: violations.length === 0 ? "pass" : "fail",
    violations: violations.slice(0, 100),
    explanation: {
      fr: `${lists.length} liste(s) analysée(s), ${violations.length} problème(s)`,
      en: `${lists.length} list(s) analyzed, ${violations.length} issue(s)`
    }
  }
}
