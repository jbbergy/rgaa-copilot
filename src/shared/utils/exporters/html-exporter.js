/**
 * HTML Export Generator
 * Creates standalone HTML report with embedded CSS for offline viewing
 */

export function generateHTMLReport(auditData) {
  const { metadata, summary, results } = auditData

  const html = `<!DOCTYPE html>
<html lang="${metadata.language || "fr"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport d'Audit RGAA - ${metadata.url}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #212121;
      background: #f5f5f5;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: #ffffff;
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .metadata {
      opacity: 0.9;
      font-size: 0.875rem;
    }

    .metadata-item {
      display: inline-block;
      margin-right: 1.5rem;
      margin-top: 0.5rem;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 2rem;
      background: #f5f5f5;
      border-bottom: 2px solid #e0e0e0;
    }

    .stat-card {
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid;
    }

    .stat-card.pass { border-left-color: #2e7d32; }
    .stat-card.fail { border-left-color: #c62828; }
    .stat-card.manual { border-left-color: #ef6c00; }
    .stat-card.na { border-left-color: #757575; }

    .stat-label {
      font-size: 0.875rem;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #212121;
    }

    .results {
      padding: 2rem;
    }

    .results h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      color: #212121;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.5rem;
    }

    .criterion {
      margin-bottom: 1.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .criterion-header {
      padding: 1rem 1.5rem;
      background: #fafafa;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-left: 5px solid;
    }

    .criterion.pass .criterion-header { border-left-color: #2e7d32; }
    .criterion.fail .criterion-header { border-left-color: #c62828; }
    .criterion.manual .criterion-header { border-left-color: #ef6c00; }

    .status-icon {
      font-size: 1.5rem;
      width: 30px;
      text-align: center;
    }

    .criterion-info {
      flex: 1;
    }

    .criterion-id {
      font-weight: 700;
      color: #1976d2;
      font-size: 0.875rem;
    }

    .criterion-title {
      color: #212121;
      font-size: 1rem;
    }

    .severity-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      background: #e3f2fd;
      color: #1976d2;
    }

    .violation-count {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 700;
      background: #c62828;
      color: #ffffff;
    }

    .criterion-details {
      padding: 1.5rem;
      background: #ffffff;
      border-top: 1px solid #e0e0e0;
    }

    .violations-list {
      margin-top: 1rem;
    }

    .violation-item {
      padding: 1rem;
      background: #f5f5f5;
      border-left: 4px solid #c62828;
      margin-bottom: 0.75rem;
      border-radius: 4px;
    }

    .violation-selector {
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 0.875rem;
      color: #1976d2;
      margin-bottom: 0.5rem;
    }

    .violation-html {
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 0.875rem;
      background: #263238;
      color: #aed581;
      padding: 0.75rem;
      border-radius: 4px;
      overflow-x: auto;
      margin-bottom: 0.5rem;
    }

    .violation-message {
      color: #c62828;
      font-weight: 500;
      font-size: 0.875rem;
    }

    footer {
      padding: 2rem;
      background: #fafafa;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #757575;
      font-size: 0.875rem;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }

      .container {
        box-shadow: none;
      }

      .criterion {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Rapport d'Audit RGAA ${metadata.rgaaVersion}</h1>
      <div class="metadata">
        <div class="metadata-item"><strong>URL :</strong> ${escapeHTML(metadata.url)}</div>
        <div class="metadata-item"><strong>Date :</strong> ${formatDate(metadata.timestamp)}</div>
        <div class="metadata-item"><strong>Extension :</strong> v${metadata.extensionVersion}</div>
      </div>
    </header>

    <div class="summary">
      <div class="stat-card pass">
        <div class="stat-label">Conformes</div>
        <div class="stat-value">${summary.pass}</div>
      </div>
      <div class="stat-card fail">
        <div class="stat-label">Non conformes</div>
        <div class="stat-value">${summary.fail}</div>
      </div>
      <div class="stat-card manual">
        <div class="stat-label">Vérification manuelle</div>
        <div class="stat-value">${summary.manualCheck}</div>
      </div>
      <div class="stat-card na">
        <div class="stat-label">Non applicable</div>
        <div class="stat-value">${summary.notApplicable}</div>
      </div>
    </div>

    <div class="results">
      <h2>Résultats détaillés</h2>
      ${results.map(criterion => renderCriterion(criterion)).join("")}
    </div>

    <footer>
      <p>Généré par l'extension RGAA Copilot v${metadata.extensionVersion}</p>
      <p>Ce rapport est conforme au Référentiel Général d'Amélioration de l'Accessibilité (RGAA) version ${metadata.rgaaVersion}</p>
      <p>Pour plus d'informations : <a href="https://accessibilite.numerique.gouv.fr/" target="_blank">accessibilite.numerique.gouv.fr</a></p>
    </footer>
  </div>
</body>
</html>`

  return html
}

function renderCriterion(criterion) {
  const statusIcon = {
    pass: "✓",
    fail: "✗",
    "manual-check": "⚠",
    "not-applicable": "—",
    manual: "⚠"
  }[criterion.status] || "?"

  const statusClass = criterion.status === "manual-check" || criterion.status === "manual" ? "manual" : criterion.status

  // Handle multilingual title
  const title = typeof criterion.title === "object" ? (criterion.title.fr || criterion.title.en) : criterion.title
  const topicTitle = typeof criterion.topicTitle === "object" ? (criterion.topicTitle.fr || criterion.topicTitle.en) : criterion.topicTitle

  let detailsHTML = ""

  if (criterion.violations && criterion.violations.length > 0) {
    detailsHTML = `
      <div class="criterion-details">
        <strong>Violations trouvées : ${criterion.violations.length}</strong>
        <div class="violations-list">
          ${criterion.violations.slice(0, 100).map(v => {
      // Handle multilingual message
      const message = typeof v.message === "object" ? (v.message.fr || v.message.en) : v.message
      return `
            <div class="violation-item">
              <div class="violation-selector">${escapeHTML(v.selector || v.element)}</div>
              <div class="violation-html">${escapeHTML(v.html)}</div>
              <div class="violation-message">${escapeHTML(message)}</div>
            </div>
          `}).join("")}
          ${criterion.violations.length > 100 ? `<p><em>+ ${criterion.violations.length - 100} violations supplémentaires non affichées</em></p>` : ""}
        </div>
      </div>
    `
  }

  return `
    <div class="criterion ${statusClass}">
      <div class="criterion-header">
        <span class="status-icon">${statusIcon}</span>
        <div class="criterion-info">
          <div class="criterion-id">${criterion.criterionId}${topicTitle ? ` - ${escapeHTML(topicTitle)}` : ""}</div>
          <div class="criterion-title">${escapeHTML(title)}</div>
        </div>
        <span class="severity-badge">${criterion.level}</span>
        ${criterion.violations && criterion.violations.length > 0 ? `<span class="violation-count">${criterion.violations.length}</span>` : ""}
      </div>
      ${detailsHTML}
    </div>
  `
}

function escapeHTML(str) {
  if (!str) return ""
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}
