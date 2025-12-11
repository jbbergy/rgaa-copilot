<template>
  <div class="audit-summary">
    <!-- T238: aria-live region for audit status changes -->
    <div
      id="audit-status-announcements"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ statusAnnouncement }}
    </div>

    <div class="action-buttons">
      <button
        v-if="!isAuditing"
        class="btn-primary audit-button"
        :disabled="isAuditing"
        :aria-label="t(hasResults ? 'audit.rescanButton' : 'audit.startButton')"
        @click="startAudit"
      >
        {{ t(hasResults ? "audit.rescanButton" : "audit.startButton") }}
      </button>

      <button
        v-if="hasResults && !isAuditing"
        ref="exportButtonRef"
        class="btn-secondary export-button"
        :aria-label="t('export.button')"
        @click="openExportDialog"
      >
        📥 {{ t("export.button") }}
      </button>
    </div>

    <div
      v-if="isAuditing"
      class="progress-container"
      role="region"
      aria-labelledby="progress-label"
    >
      <p id="progress-label">{{ t("audit.inProgress") }}</p>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
          role="progressbar"
          :aria-valuenow="progress.current"
          :aria-valuemin="0"
          :aria-valuemax="progress.total"
          :aria-label="t('audit.progress', { current: progress.current, total: progress.total })"
        />
      </div>
      <p class="progress-text">
        {{ progress.current }} / {{ progress.total }}
      </p>
    </div>

    <!-- T240: aria-live="assertive" for error messages -->
    <div
      v-if="error"
      class="error-message"
      role="alert"
      aria-live="assertive"
    >
      {{ t("errors.auditFailed") }}
    </div>

    <div
      v-if="hasResults && !isAuditing"
      class="results-summary"
    >
      <h2>{{ t("audit.complete") }}</h2>

      <!-- T255: Group summary cards with role and aria-label -->
      <div
        class="summary-grid"
        role="group"
        :aria-label="t('audit.summary.label')"
      >
        <!-- T253/T254: Improved accessible names with current state -->
        <button
          class="summary-card summary-passed"
          :class="{ 'filter-active': activeFilters.has('pass') }"
          :aria-pressed="activeFilters.has('pass')"
          :aria-label="getFilterButtonLabel('pass', summary.passed)"
          :aria-describedby="'pass-description'"
          @click="toggleFilter('pass')"
        >
          <div class="summary-number">
            {{ summary.passed }}
          </div>
          <div class="summary-label">
            {{ t("audit.summary.passed") }}
          </div>
          <span
            id="pass-description"
            class="sr-only"
          >
            {{ t("audit.summary.passedDescription") }}
          </span>
        </button>

        <button
          class="summary-card summary-failed"
          :class="{ 'filter-active': activeFilters.has('fail') }"
          :aria-pressed="activeFilters.has('fail')"
          :aria-label="getFilterButtonLabel('fail', summary.failed)"
          :aria-describedby="'fail-description'"
          @click="toggleFilter('fail')"
        >
          <div class="summary-number">
            {{ summary.failed }}
          </div>
          <div class="summary-label">
            {{ t("audit.summary.failed") }}
          </div>
          <span
            id="fail-description"
            class="sr-only"
          >
            {{ t("audit.summary.failedDescription") }}
          </span>
        </button>

        <button
          class="summary-card summary-manual"
          :class="{ 'filter-active': activeFilters.has('manual') }"
          :aria-pressed="activeFilters.has('manual')"
          :aria-label="getFilterButtonLabel('manual', summary.manualCheckRequired)"
          :aria-describedby="'manual-description'"
          @click="toggleFilter('manual')"
        >
          <div class="summary-number">
            {{ summary.manualCheckRequired }}
          </div>
          <div class="summary-label">
            {{ t("audit.summary.manual") }}
          </div>
          <span
            id="manual-description"
            class="sr-only"
          >
            {{ t("audit.summary.manualDescription") }}
          </span>
        </button>
      </div>

      <div
        v-if="warnings"
        class="warning-banner"
        role="alert"
      >
        <strong>⚠️ {{ t("errors.iframeWarning") }}</strong>
      </div>
    </div>

    <ExportDialog
      :is-open="showExportDialog"
      :audit-data="exportData"
      @close="closeExportDialog"
      @export-complete="onExportComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue"
import { useAudit } from "../composables/useAudit.js"
import { useI18n } from "../composables/useI18n.js"
import ExportDialog from "./ExportDialog.vue"
import browser from "webextension-polyfill"

const { startAudit, isAuditing, hasResults, summary, progress, error, warnings, auditResults, activeFilters, toggleFilter } = useAudit()
const { t, language } = useI18n()

const showExportDialog = ref(false)
const exportButtonRef = ref(null)

// T238: Status announcement for screen readers
const statusAnnouncement = computed(() => {
  if (isAuditing.value) {
    return t("audit.inProgress")
  }
  if (error.value) {
    return t("errors.auditFailed")
  }
  if (hasResults.value && summary.value) {
    return t("audit.completeAnnouncement", {
      passed: summary.value.passed,
      failed: summary.value.failed,
      manual: summary.value.manualCheckRequired
    })
  }
  return ""
})

const progressPercent = computed(() => {
  if (progress.value.total === 0) return 0
  return Math.round((progress.value.current / progress.value.total) * 100)
})

const exportData = computed(() => {
  if (!auditResults.value) return null

  return {
    metadata: {
      url: auditResults.value.pageUrl || window.location.href,
      timestamp: auditResults.value.timestamp || Date.now(),
      rgaaVersion: auditResults.value.rgaaVersion || "4.1",
      extensionVersion: auditResults.value.extensionVersion || browser.runtime.getManifest().version,
      language: language.value,
      userAgent: navigator.userAgent
    },
    summary: {
      pass: summary.value.passed || 0,
      fail: summary.value.failed || 0,
      manualCheck: summary.value.manualCheckRequired || 0,
      notApplicable: summary.value.notApplicable || 0
    },
    results: auditResults.value.criteriaResults || []
  }
})

// T254: Get accessible filter button label including current state
function getFilterButtonLabel(status, count) {
  const statusName = t(`audit.summary.${status === "pass" ? "passed" : status === "fail" ? "failed" : "manual"}`)
  const isActive = activeFilters.value.has(status)
  const activeState = isActive ? t("audit.filter.active") : t("audit.filter.inactive")

  return `${statusName}: ${count}. ${t("audit.filter.toggle")}. ${activeState}`
}

function openExportDialog() {
  showExportDialog.value = true
}

// T244: Focus restoration when closing ExportDialog
function closeExportDialog() {
  showExportDialog.value = false
  nextTick(() => {
    exportButtonRef.value?.focus()
  })
}

function onExportComplete({ format, filename }) {
  console.log(`Export complete: ${format} - ${filename}`)
  closeExportDialog()
}
</script>

<style scoped>
.audit-summary {
  margin-bottom: var(--space-lg);
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.action-buttons {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.audit-button {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: var(--font-size-sm);
}

.export-button {
  flex: 0 0 auto;
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.export-button:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
  transform: scale(1.04);
}

.export-button:active {
  transform: scale(0.98);
}

/* T247: Focus visible for all buttons */
.export-button:focus,
.export-button:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: scale(1.02);
  box-shadow: var(--shadow-glow);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

/* T247: Focus visible for primary button */
.btn-primary:focus,
.btn-primary:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.progress-container {
  text-align: center;
  background: var(--color-bg-secondary);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--space-md) 0;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--transition-slow) ease;
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
}

.progress-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-sm);
  font-weight: var(--font-weight-medium);
}

.error-message {
  padding: var(--space-md) var(--space-lg);
  background: rgba(239, 83, 80, 0.15);
  color: var(--color-error);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-error);
  font-weight: var(--font-weight-medium);
}

.results-summary h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-lg);
  color: var(--color-text-bright);
  letter-spacing: -0.3px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.summary-card {
  padding: var(--space-lg) var(--space-md);
  border-radius: var(--radius-lg);
  text-align: center;
  border: none;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  box-shadow: var(--shadow-sm);
  background: var(--color-bg-secondary);
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.summary-card:active {
  transform: translateY(-2px);
}

.summary-card:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.summary-card:not(.filter-active) {
  opacity: 1;
}

.summary-card.filter-active {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 0 0 2px var(--color-primary), var(--shadow-lg);
}

.summary-passed {
  background: var(--color-bg-tertiary);
  border-left: 4px solid var(--color-success);
}

.summary-passed .summary-number {
  color: var(--color-success);
}

.summary-passed .summary-label {
  color: var(--color-text-primary);
}

.summary-failed {
  background: var(--color-bg-tertiary);
  border-left: 4px solid var(--color-error);
}

.summary-failed .summary-number {
  color: var(--color-error);
}

.summary-failed .summary-label {
  color: var(--color-text-primary);
}

.summary-manual {
  background: var(--color-bg-tertiary);
  border-left: 4px solid var(--color-warning);
}

.summary-manual .summary-number {
  color: var(--color-warning);
}

.summary-manual .summary-label {
  color: var(--color-text-primary);
}

.summary-number {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: 1;
  margin-bottom: var(--space-sm);
  letter-spacing: -1px;
}

.summary-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.warning-banner {
  padding: var(--space-md) var(--space-lg);
  background: rgba(255, 167, 38, 0.15);
  border-left: 4px solid var(--color-warning);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

/* Dark mode - pas besoin d'ajustements, tokens g\u00e8rent tout */

/* T258: Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

  .audit-button,
  .export-button,
  .summary-card,
  .progress-fill {
    transition: none;
  }

  .summary-card:hover,
  .summary-card:active {
    transform: none;
  }

  .summary-card.filter-active {
    transform: none;
  }

  .btn-primary:hover:not(:disabled),
  .btn-primary:active:not(:disabled) {
    transform: none;
  }
}

/* T259/T261: High contrast mode support */
@media (prefers-contrast: more) {
  .summary-card {
    border-width: 4px;
  }

  .summary-card:focus {
    outline-width: 4px;
  }

  .error-message {
    border-left-width: 6px;
  }

  .warning-banner {
    border-left-width: 6px;
  }
}
</style>
