/**
 * JSON Export Generator
 * Creates structured JSON with complete audit data
 */

export function generateJSONReport(auditData) {
  const { metadata, summary, results } = auditData

  const jsonReport = {
    metadata: {
      url: metadata.url,
      timestamp: metadata.timestamp,
      rgaaVersion: metadata.rgaaVersion || "4.1",
      extensionVersion: metadata.extensionVersion,
      language: metadata.language || "fr",
      userAgent: metadata.userAgent || navigator.userAgent
    },
    summary: {
      passed: summary.pass,
      failed: summary.fail,
      manualCheck: summary.manualCheck,
      notApplicable: summary.notApplicable,
      total: summary.pass + summary.fail + summary.manualCheck + summary.notApplicable
    },
    results: results.map(criterion => {
      // Handle multilingual fields
      const title = typeof criterion.title === "object" ? criterion.title : { fr: criterion.title, en: criterion.title }
      const topicTitle = typeof criterion.topicTitle === "object" ? criterion.topicTitle : { fr: criterion.topicTitle, en: criterion.topicTitle }

      return {
        criterionId: criterion.criterionId,
        title,
        status: criterion.status,
        level: criterion.level,
        wcagMapping: criterion.wcagMapping || [],
        topic: criterion.topic,
        topicTitle,
        violations: criterion.violations ? criterion.violations.map(v => {
          const message = typeof v.message === "object" ? v.message : { fr: v.message, en: v.message }
          return {
            selector: v.selector || v.element,
            element: v.element,
            html: v.html,
            message,
            xpath: v.xpath
          }
        }) : [],
        violationCount: criterion.violations ? criterion.violations.length : 0
      }
    })
  }

  return JSON.stringify(jsonReport, null, 2)
}
