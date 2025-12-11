/**
 * CSV Export Generator
 * Creates spreadsheet-compatible CSV with audit results
 */

export function generateCSVReport(auditData) {
  const { metadata, results } = auditData

  // CSV header
  const headers = [
    "Criterion",
    "Title",
    "Status",
    "Severity",
    "Topic",
    "WCAG",
    "Violations",
    "Description"
  ]

  // Build CSV rows
  const rows = [headers]

  for (const criterion of results) {
    // Handle multilingual fields
    const title = typeof criterion.title === "object" ? (criterion.title.fr || criterion.title.en) : criterion.title
    const topicTitle = typeof criterion.topicTitle === "object" ? (criterion.topicTitle.fr || criterion.topicTitle.en) : criterion.topicTitle

    const row = [
      escapeCsvField(criterion.criterionId),
      escapeCsvField(title),
      escapeCsvField(criterion.status),
      escapeCsvField(criterion.level),
      escapeCsvField(topicTitle),
      escapeCsvField(criterion.wcagMapping ? criterion.wcagMapping.join(", ") : ""),
      criterion.violations ? criterion.violations.length : 0,
      escapeCsvField(getStatusDescription(criterion.status))
    ]
    rows.push(row)

    // Add violation details as sub-rows
    if (criterion.violations && criterion.violations.length > 0) {
      for (const violation of criterion.violations.slice(0, 100)) {
        const message = typeof violation.message === "object" ? (violation.message.fr || violation.message.en) : violation.message
        const selector = violation.selector || violation.element
        const violationRow = [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          escapeCsvField(`${selector}: ${message}`)
        ]
        rows.push(violationRow)
      }
    }
  }

  // Add metadata footer
  rows.push([])
  rows.push(["Metadata"])
  rows.push(["URL", escapeCsvField(metadata.url)])
  rows.push(["Date", new Date(metadata.timestamp).toISOString()])
  rows.push(["RGAA Version", metadata.rgaaVersion || "4.1"])
  rows.push(["Extension Version", metadata.extensionVersion])

  // Convert to CSV string
  return rows.map(row => row.join(",")).join("\n")
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return ""

  const str = String(field)

  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
    return `"${str.replace(/"/g, "\"\"")}"`
  }

  return str
}

function getStatusDescription(status) {
  const descriptions = {
    pass: "Criterion passed - no violations detected",
    fail: "Criterion failed - violations found",
    "manual-check": "Manual verification required",
    "not-applicable": "Criterion not applicable to this page"
  }
  return descriptions[status] || status
}
