/**
 * WCAG 2.1 to RGAA 4.1 Mapping
 * Links WCAG success criteria to corresponding RGAA criteria
 */

export const wcagMapping = {
  // Level A
  "1.1.1": {
    title: "Non-text Content",
    level: "A",
    rgaaCriteria: ["1.1", "1.2", "1.3"]
  },
  "1.3.1": {
    title: "Info and Relationships",
    level: "A",
    rgaaCriteria: ["9.1", "11.1", "5.1"]
  },
  "2.4.7": {
    title: "Focus Visible",
    level: "AA",
    rgaaCriteria: ["10.7"]
  },
  "3.3.2": {
    title: "Labels or Instructions",
    level: "A",
    rgaaCriteria: ["11.1", "11.2"]
  },
  "4.1.1": {
    title: "Parsing",
    level: "A",
    rgaaCriteria: ["8.2"]
  },

  // Level AA
  "1.4.3": {
    title: "Contrast (Minimum)",
    level: "AA",
    rgaaCriteria: ["3.2"]
  }
}

/**
 * Get RGAA criteria for a WCAG success criterion
 */
export function getRGAAForWCAG(wcagId) {
  return wcagMapping[wcagId] || null
}

/**
 * Get WCAG info for an RGAA criterion
 */
export function getWCAGForRGAA(rgaaId) {
  const results = []
  for (const [wcagId, data] of Object.entries(wcagMapping)) {
    if (data.rgaaCriteria.includes(rgaaId)) {
      results.push({ id: wcagId, ...data })
    }
  }
  return results
}
