<template>
  <div
    id="rgaa-auditor"
    class="app-container"
    @keydown.escape="handleEscapeKey"
  >
    <!-- T248: Skip link to jump to results -->
    <a
      href="#main-results"
      class="skip-link"
    >
      {{ t("common.skipToResults") }}
    </a>

    <header class="app-header">
      <div class="header-content">
        <div class="header-text">
          <h1>{{ t("app.title") }}</h1>
          <p class="app-subtitle">
            {{ t("app.subtitle") }}
          </p>
        </div>
        <div class="header-actions">
          <!-- T265: Help button for keyboard shortcuts documentation -->
          <button
            ref="helpButtonRef"
            class="btn-help"
            :aria-label="t('help.button')"
            :title="t('help.button')"
            @click="openHelpDialog"
          >
            <span class="icon">❓</span>
          </button>
          <button
            ref="historyButtonRef"
            class="btn-history"
            :aria-label="t('history.button')"
            :title="t('history.button')"
            @click="openHistoryPanel"
          >
            <span class="icon">📜</span>
          </button>
          <button
            class="language-toggle"
            :aria-label="t('settings.switchLanguage')"
            :title="t('settings.currentLanguage', { lang: language.toUpperCase() })"
            @click="toggleLanguage"
          >
            <span class="icon">🌐</span>
            <span class="lang-text">{{ language.toUpperCase() }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- T255: Group summary cards with role and aria-label -->
    <main
      id="main-results"
      class="app-main"
      role="main"
      :aria-busy="isAuditing"
    >
      <AuditSummary />
      <CriterionList v-if="hasResults" />
    </main>

    <HistoryPanel
      v-if="showHistoryPanel"
      :current-url="currentUrl"
      @close="closeHistoryPanel"
      @select="onHistorySelect"
      @compare="onHistoryCompare"
    />

    <!-- T238/T240: Live region for status announcements -->
    <div
      id="live-announcements"
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    />

    <!-- T265: Help dialog with keyboard shortcuts -->
    <HelpDialog
      v-if="showHelpDialog"
      :is-open="showHelpDialog"
      @close="closeHelpDialog"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { useI18n } from "./composables/useI18n.js"
import { useAudit } from "./composables/useAudit.js"
import AuditSummary from "./components/AuditSummary.vue"
import CriterionList from "./components/CriterionList.vue"
import HistoryPanel from "./components/HistoryPanel.vue"
import HelpDialog from "./components/HelpDialog.vue"
import browser from "webextension-polyfill"

const { t, language, switchLanguage } = useI18n()
const { hasResults, initialize, isAuditing } = useAudit()

const showHistoryPanel = ref(false)
const showHelpDialog = ref(false)
const currentUrl = ref("")
const historyButtonRef = ref(null)
const helpButtonRef = ref(null)

onMounted(async () => {
  await initialize()
})

function toggleLanguage() {
  switchLanguage(language.value === "fr" ? "en" : "fr")
}

async function openHistoryPanel() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (tabs[0]) {
    currentUrl.value = tabs[0].url
  }
  showHistoryPanel.value = true
}

// T244: Focus restoration when closing HistoryPanel
function closeHistoryPanel() {
  showHistoryPanel.value = false
  // Return focus to trigger button
  nextTick(() => {
    historyButtonRef.value?.focus()
  })
}

// T265: Help dialog functions
function openHelpDialog() {
  showHelpDialog.value = true
}

function closeHelpDialog() {
  showHelpDialog.value = false
  // Return focus to help button
  nextTick(() => {
    helpButtonRef.value?.focus()
  })
}

// T249: Global Escape key handler for closing all dialogs
function handleEscapeKey() {
  if (showHelpDialog.value) {
    closeHelpDialog()
  } else if (showHistoryPanel.value) {
    closeHistoryPanel()
  }
}

function onHistorySelect(audit) {
  console.log("Selected audit:", audit)
}

function onHistoryCompare(comparison) {
  console.log("Compare audits:", comparison)
}
</script>

<style scoped>
.app-container {
  width: 500px;
  min-height: 400px;
  max-height: 600px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
}

/* T248: Skip link styling - Spotify style */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-primary);
  color: var(--color-primary-text);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  z-index: 1000;
  border-radius: 0 0 var(--radius-md) 0;
  transition: top var(--transition-base);
}

.skip-link:focus {
  top: 0;
  outline: 3px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* T242/T238: Screen reader only class for announcements */
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

.app-header {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-divider);
  padding: var(--space-lg) var(--space-md);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
}

.header-text {
  flex: 1;
}

.app-header h1 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-bright);
  letter-spacing: -0.5px;
}

.app-subtitle {
  margin: var(--space-xs) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-normal);
}

.header-actions {
  display: flex;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.btn-help,
.btn-history,
.language-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-help:hover,
.btn-history:hover,
.language-toggle:hover {
  background: var(--color-bg-hover);
  transform: scale(1.04);
}

.btn-help:active,
.btn-history:active,
.language-toggle:active {
  transform: scale(0.98);
}

/* T247/T260: Focus visible outline for all interactive elements */
.btn-help:focus,
.btn-history:focus,
.language-toggle:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.btn-help:focus-visible,
.btn-history:focus-visible,
.language-toggle:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.icon {
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-text {
  font-weight: var(--font-weight-semibold);
  font-size: 11px;
  letter-spacing: 0.5px;
}

.app-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  background: var(--color-bg-primary);
}

/* T258: Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

  .skip-link,
  .btn-help,
  .btn-history,
  .language-toggle {
    transition: none;
    transform: none !important;
  }
}

/* T259/T261: High contrast mode support */
@media (prefers-contrast: more) {
  .skip-link {
    border: 2px solid currentColor;
  }

  .btn-help,
  .btn-history,
  .language-toggle {
    border-width: 2px;
  }

  .btn-help:focus,
  .btn-history:focus,
  .language-toggle:focus {
    outline-width: 4px;
  }
}
</style>
