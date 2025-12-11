<template>
  <div
    v-if="criterion"
    class="criterion-detail"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="dialogTitleId"
    :aria-describedby="dialogDescId"
    @keydown.esc="closeDetail"
  >
    <div
      class="detail-overlay"
      @click="closeDetail"
    />

    <div class="detail-panel">
      <header class="detail-header">
        <h2
          :id="dialogTitleId"
          class="criterion-title"
        >
          {{ criterion.criterionId }} - {{ criterionTitle }}
        </h2>
        <button
          class="close-button"
          :aria-label="t('criterion.closeDetail')"
          @click="closeDetail"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>

      <div
        :id="dialogDescId"
        class="detail-content"
      >
        <!-- Level Badge and WCAG Mapping -->
        <div class="meta-info">
          <span
            class="severity-badge"
            :class="`severity-${criterion.level?.toLowerCase()}`"
            :aria-label="`${t('criterion.level')} ${criterion.level}`"
          >
            {{ criterion.level }}
          </span>
          <span
            v-if="criterion.wcagMapping"
            class="wcag-mapping"
          >
            WCAG {{ criterion.wcagMapping.join(", ") }}
          </span>
        </div>

        <!-- Status Badge -->
        <div
          class="status-badge"
          :class="`status-${criterion.status}`"
        >
          {{ getStatusLabel(criterion.status) }}
        </div>

        <!-- Plain Language Summary -->
        <section class="plain-language-summary">
          <h3>{{ t("criterion.whyItMatters") }}</h3>
          <p>{{ getLocalizedText(criterion.whyItMatters) || getLocalizedText(criterion.explanation) || criterion.summary
            || criterion.description }}</p>
        </section>

        <!-- Official RGAA Test Procedure -->
        <section
          v-if="criterion.testProcedure || criterion.methodology"
          class="test-procedure"
        >
          <h3>{{ t("criterion.testProcedure") }}</h3>
          <div v-html="sanitize(criterion.testProcedure || criterion.methodology)" />
        </section>

        <!-- Violations (if failed) -->
        <section
          v-if="criterion.violations && criterion.violations.length > 0"
          class="violations-section"
        >
          <h3>{{ t("criterion.violations") }} ({{ criterion.violations.length }})</h3>

          <ul class="violation-list">
            <li
              v-for="(violation, index) in displayedViolations"
              :key="index"
              class="violation-instance"
              @click="highlightElement(violation.selector || violation.element)"
            >
              <div class="violation-header">
                <span class="element-type-badge">{{ getElementType(violation.selector || violation.element) }}</span>
                <button
                  class="highlight-btn"
                  :aria-label="t('criterion.highlightElement')"
                  @click.stop="highlightElement(violation.selector || violation.element)"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="8"
                    />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  {{ t("criterion.locate") }}
                </button>
              </div>
              <div class="css-selector">
                <span class="selector-label">{{ t("criterion.selector") || "Sélecteur" }}:</span>
                <code
                  :title="violation.selector || violation.element">{{ formatSelector(violation.selector || violation.element) }}</code>
              </div>
              <div
                v-if="violation.html"
                class="code-snippet"
              >
                <span class="code-label">{{ t("criterion.htmlCode") || "Code HTML" }}:</span>
                <pre><code v-html="highlightCode(violation.html)" /></pre>
              </div>
              <p class="violation-message">
                <span class="message-icon">⚠️</span>
                {{ getLocalizedText(violation.message) }}
              </p>
              <p
                v-if="violation.remediation"
                class="violation-remediation"
              >
                <span class="remediation-icon">💡</span>
                {{ getLocalizedText(violation.remediation) }}
              </p>
            </li>
          </ul>

          <button
            v-if="criterion.violations.length > maxDisplayedViolations"
            class="show-more-button"
            @click="showAllViolations = !showAllViolations"
          >
            {{ showAllViolations
              ? t("criterion.showLess")
              : t("criterion.showMore", { count: criterion.violations.length - maxDisplayedViolations })
            }}
          </button>
        </section>

        <!-- Remediation Instructions -->
        <section
          v-if="criterion.remediation"
          class="remediation-instructions"
        >
          <h3>{{ t("criterion.howToFix") }}</h3>

          <div class="remediation-content">
            <p>{{ criterion.remediation?.description }}</p>

            <!-- Before/After Code Examples -->
            <div
              v-if="criterion.remediation?.beforeCode"
              class="code-comparison"
            >
              <div class="code-before">
                <h4>{{ t("criterion.beforeFix") }}</h4>
                <pre><code v-html="highlightCode(criterion.remediation.beforeCode)" /></pre>
              </div>
              <div class="code-after">
                <h4>{{ t("criterion.afterFix") }}</h4>
                <pre><code v-html="highlightCode(criterion.remediation.afterCode)" /></pre>
              </div>
            </div>

            <!-- Step-by-step instructions -->
            <div
              v-if="criterion.remediation?.steps"
              class="fix-steps"
            >
              <h4>{{ t("criterion.stepByStep") }}</h4>
              <ol>
                <li
                  v-for="(step, index) in criterion.remediation.steps"
                  :key="index"
                >
                  {{ step }}
                </li>
              </ol>
            </div>
          </div>
        </section>

        <!-- Manual Testing Instructions (for semi-automated criteria) -->
        <section
          v-if="criterion.status === 'manual-check' || criterion.manualSteps"
          class="manual-testing-instructions"
        >
          <h3>{{ t("criterion.manualVerification") }}</h3>
          <div v-html="sanitize(criterion.manualSteps || criterion.manualInstructions)" />
        </section>

        <!-- Official RGAA Documentation Link -->
        <section class="documentation-link">
          <a
            :href="getRGAADocumentationUrl(criterion.criterionId)"
            target="_blank"
            rel="noopener noreferrer"
            class="rgaa-doc-link"
          >
            <span>{{ t("criterion.viewOfficialRGAA") }}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useI18n } from "../composables/useI18n"
import browser from "webextension-polyfill"

const props = defineProps({
  criterion: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(["close", "highlight"])

const { t, language } = useI18n()

const showAllViolations = ref(false)
const maxDisplayedViolations = 5

const dialogTitleId = computed(() => `criterion-detail-title-${props.criterion?.criterionId}`)
const dialogDescId = computed(() => `criterion-detail-desc-${props.criterion?.criterionId}`)

// Handle title which can be an object with fr/en or a string
const criterionTitle = computed(() => {
  const title = props.criterion?.title
  if (!title) return ""
  if (typeof title === "object") {
    return title[language.value] || title.fr || title.en || ""
  }
  return title
})

const displayedViolations = computed(() => {
  if (!props.criterion?.violations) return []
  if (showAllViolations.value) return props.criterion.violations
  return props.criterion.violations.slice(0, maxDisplayedViolations)
})

/**
 * Get localized text from an object with fr/en keys or return string as-is
 */
function getLocalizedText(text) {
  if (!text) return ""
  if (typeof text === "object") {
    return text[language.value] || text.fr || text.en || ""
  }
  return text
}

function closeDetail() {
  emit("close")
}

function highlightElement(selector) {
  emit("highlight", selector)

  // Send message to content script
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: "HIGHLIGHT_ELEMENT",
        payload: { selector, criterionId: props.criterion.criterionId }
      })
    }
  })
}

function getStatusLabel(status) {
  const labels = {
    pass: t("passed"),
    fail: t("failed"),
    "manual-check": t("manualCheck"),
    "not-applicable": t("notApplicable")
  }
  return labels[status] || status
}

function getRGAADocumentationUrl(criterionId) {
  const baseUrl = "https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/"
  const [topic, number] = criterionId.split(".")
  return `${baseUrl}#${topic}-${number}`
}

function sanitize(html) {
  if (!html) return ""

  // Basic HTML sanitization - remove script tags and dangerous attributes
  const temp = document.createElement("div")
  temp.textContent = html
  let sanitized = temp.innerHTML

  // Allow some safe HTML tags
  sanitized = sanitized
    .replace(/&lt;strong&gt;/g, "<strong>")
    .replace(/&lt;\/strong&gt;/g, "</strong>")
    .replace(/&lt;em&gt;/g, "<em>")
    .replace(/&lt;\/em&gt;/g, "</em>")
    .replace(/&lt;code&gt;/g, "<code>")
    .replace(/&lt;\/code&gt;/g, "</code>")
    .replace(/&lt;ul&gt;/g, "<ul>")
    .replace(/&lt;\/ul&gt;/g, "</ul>")
    .replace(/&lt;ol&gt;/g, "<ol>")
    .replace(/&lt;\/ol&gt;/g, "</ol>")
    .replace(/&lt;li&gt;/g, "<li>")
    .replace(/&lt;\/li&gt;/g, "</li>")

  return sanitized
}

/**
 * Format HTML code for better human readability
 */
function formatHtmlForDisplay(code) {
  if (!code) return ""

  // Truncate data URIs for readability
  let formatted = code.replace(
    /data:([^;,]+)[^"'\s]*/g,
    (match, mimeType) => `[data:${mimeType}...]`
  )

  // Truncate very long attribute values (base64, long strings)
  formatted = formatted.replace(
    /="([^"]{80,})"/g,
    (match, value) => {
      // Keep first 40 chars and indicate truncation
      return `="${value.substring(0, 40)}..."`
    }
  )

  // Truncate long class lists
  formatted = formatted.replace(
    /class="([^"]{60,})"/g,
    (match, classes) => {
      const classList = classes.split(/\s+/)
      if (classList.length > 3) {
        return `class="${classList.slice(0, 3).join(" ")} [+${classList.length - 3}]"`
      }
      return `class="${classes.substring(0, 50)}..."`
    }
  )

  return formatted
}

function highlightCode(code) {
  if (!code) return ""

  // First format the code for readability
  const formatted = formatHtmlForDisplay(code)

  // Simple syntax highlighting for HTML
  let highlighted = formatted
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(&lt;\/?)(a-zA-Z][a-zA-Z0-9]*)/g, "$1<span class=\"tag\">$2</span>")
    .replace(/([a-zA-Z-]+)=/g, "<span class=\"attr\">$1</span>=")
    .replace(/="([^"]*)"/g, "=\"<span class=\"value\">$1</span>\"")

  return highlighted
}

/**
 * Extract element type from selector for badge display
 */
function getElementType(selector) {
  if (!selector) return "?"

  // Extract tag name from selector
  const tagMatch = selector.match(/^([a-z]+)/i)
  if (tagMatch) {
    return tagMatch[1].toUpperCase()
  }

  // Check for ID selector
  if (selector.startsWith("#")) {
    return "ID"
  }

  // Check for class selector
  if (selector.startsWith(".")) {
    return "CLASS"
  }

  return "ELEM"
}

/**
 * Format selector for better readability
 */
function formatSelector(selector) {
  if (!selector) return ""

  // If selector is short enough, return as-is
  if (selector.length <= 60) return selector

  // For long selectors, show only the last meaningful parts
  const parts = selector.split(/\s*>\s*/)
  if (parts.length > 2) {
    const lastParts = parts.slice(-2).join(" > ")
    if (lastParts.length <= 50) {
      return "... > " + lastParts
    }
  }

  // Fallback: truncate
  return selector.substring(0, 55) + "..."
}
</script>

<style scoped>
.criterion-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.detail-panel {
  position: relative;
  background: var(--color-bg-primary, #ffffff);
  border-radius: 8px;
  max-width: 800px;
  max-height: 90vh;
  width: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  background: var(--color-bg-secondary, #f5f5f5);
}

.criterion-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #212121);
}

.close-button {
  background: transparent;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary, #757575);
  transition: all 0.2s;
}

.close-button:hover {
  background: var(--color-bg-hover, #eeeeee);
  border-color: var(--color-border-hover, #bdbdbd);
}

.close-button:focus {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.meta-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.severity-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
}

.severity-a {
  background: #ef5350;
  color: #ffffff;
}

.severity-aa {
  background: #ff9800;
  color: #000000;
}

.severity-aaa {
  background: #ffc107;
  color: #000000;
}

.wcag-mapping {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background: var(--color-bg-tertiary, #e3f2fd);
  color: var(--color-primary, #1976d2);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-pass {
  background: #c8e6c9;
  color: #2e7d32;
}

.status-fail {
  background: #ffcdd2;
  color: #c62828;
}

.status-manual-check {
  background: #fff9c4;
  color: #f57f17;
}

.status-not-applicable {
  background: #e0e0e0;
  color: #616161;
}

section {
  margin-bottom: 2rem;
}

section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary, #212121);
  margin: 0 0 0.75rem 0;
}

section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary, #757575);
  margin: 1rem 0 0.5rem 0;
}

.plain-language-summary p {
  line-height: 1.6;
  color: var(--color-text-secondary, #757575);
}

.violation-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.violation-instance {
  padding: 1rem;
  background: var(--color-bg-secondary, #f5f5f5);
  border-left: 4px solid var(--color-error, #d32f2f);
  margin-bottom: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 0 4px 4px 0;
}

.violation-instance:hover {
  background: var(--color-bg-hover, #eeeeee);
}

.violation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.element-type-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary, #1976d2);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 3px;
  font-family: monospace;
}

.highlight-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: transparent;
  border: 1px solid var(--color-primary, #1976d2);
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-primary, #1976d2);
  cursor: pointer;
  transition: all 0.2s;
}

.highlight-btn:hover {
  background: var(--color-primary, #1976d2);
  color: white;
}

.highlight-btn:focus {
  outline: 2px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.css-selector {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.selector-label,
.code-label {
  font-size: 0.75rem;
  color: var(--color-text-muted, #9e9e9e);
  font-weight: 500;
}

.css-selector code {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
  color: var(--color-primary, #1976d2);
  background: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
}

.code-snippet {
  margin-bottom: 0.5rem;
  overflow-x: auto;
}

.code-snippet .code-label {
  display: block;
  margin-bottom: 0.25rem;
}

.code-snippet pre {
  margin: 0;
  padding: 0.75rem;
  background: #263238;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 150px;
}

.code-snippet code {
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 0.875rem;
  color: #aed581;
  line-height: 1.5;
}

.code-snippet :deep(.tag) {
  color: #f06292;
}

.code-snippet :deep(.attr) {
  color: #4dd0e1;
}

.code-snippet :deep(.value) {
  color: #ffb74d;
}

.violation-message {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--color-error, #d32f2f);
  font-weight: 500;
  margin: 0.5rem 0 0 0;
  padding: 0.5rem;
  background: rgba(211, 47, 47, 0.08);
  border-radius: 4px;
}

.message-icon,
.remediation-icon {
  flex-shrink: 0;
}

.violation-remediation {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: var(--color-success, #2e7d32);
  font-weight: 500;
  margin: 0.5rem 0 0 0;
  padding: 0.5rem;
  background: rgba(46, 125, 50, 0.08);
  border-radius: 4px;
  font-size: 0.875rem;
}

.show-more-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-bg-secondary, #f5f5f5);
  border: 1px solid var(--color-border, #e0e0e0);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.show-more-button:hover {
  background: var(--color-bg-hover, #eeeeee);
}

.show-more-button:focus {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.code-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .code-comparison {
    grid-template-columns: 1fr;
  }
}

.code-before,
.code-after {
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

.code-before h4,
.code-after h4 {
  margin: 0;
  padding: 0.5rem 0.75rem;
  background: var(--color-bg-secondary, #f5f5f5);
}

.code-before pre,
.code-after pre {
  margin: 0;
  padding: 0.75rem;
  background: #263238;
}

.fix-steps ol {
  padding-left: 1.5rem;
}

.fix-steps li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.documentation-link {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

.rgaa-doc-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-primary, #1976d2);
  color: #ffffff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background 0.2s;
}

.rgaa-doc-link:hover {
  background: var(--color-primary-dark, #1565c0);
}

.rgaa-doc-link:focus {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}
</style>
