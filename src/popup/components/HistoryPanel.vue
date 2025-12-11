<template>
  <div
    class="history-panel-overlay"
    role="dialog"
    aria-modal="true"
    :aria-label="t('history.title')"
    @click.self="$emit('close')"
    @keydown="handleOverlayKeydown"
  >
    <div
      ref="panelRef"
      class="history-panel"
      tabindex="-1"
    >
      <div class="history-content">
        <div class="history-header">
          <h2 id="history-dialog-title">{{ t("history.title") }}</h2>
          <div class="history-actions">
            <button
              v-if="audits.length > 0"
              class="btn-clear"
              :aria-label="t('history.clearAll')"
              @click="handleClearHistory"
            >
              {{ t("history.clear") }}
            </button>
            <button
              ref="closeButtonRef"
              class="btn-close"
              :aria-label="t('common.close')"
              @click="$emit('close')"
            >
              ×
            </button>
          </div>
        </div>

        <div
          v-if="isLoading"
          class="loading"
          role="status"
          aria-live="polite"
        >
          {{ t("common.loading") }}
        </div>

        <div
          v-else-if="error"
          class="error"
          role="alert"
        >
          {{ t("history.errorLoading") }}: {{ error }}
        </div>

        <div
          v-else-if="showQuotaWarning"
          class="quota-warning"
          role="alert"
        >
          ⚠️ {{ t("errors.storageQuota", { percent: storageUsagePercent }) }}
        </div>

        <div
          v-else-if="audits.length === 0"
          class="empty"
        >
          <p>{{ t("history.empty") }}</p>
          <p class="empty-hint">
            {{ t("history.emptyHint") }}
          </p>
        </div>

        <div
          v-else
          ref="historyListRef"
          class="history-list"
          role="listbox"
          :aria-label="t('history.auditList')"
          tabindex="0"
          @keydown="handleListKeydown"
        >
          <div
            v-for="(audit, index) in sortedAudits"
            :key="audit.timestamp"
            :ref="el => setItemRef(el, index)"
            class="history-item"
            role="option"
            :aria-selected="selectedAudit?.timestamp === audit.timestamp"
            :class="{
              selected: selectedAudit?.timestamp === audit.timestamp,
              focused: focusedIndex === index
            }"
            :tabindex="focusedIndex === index ? 0 : -1"
            @click="selectAudit(audit, index)"
            @keydown.enter="selectAudit(audit, index)"
            @keydown.space.prevent="selectAudit(audit, index)"
          >
            <div class="audit-info">
              <div class="audit-date">
                {{ formatDate(audit.timestamp) }}
              </div>
              <div class="audit-time">
                {{ formatTime(audit.timestamp) }}
              </div>
            </div>

            <div class="audit-summary">
              <span class="badge badge-success">
                <span class="badge-label">{{ t("common.pass") }}:</span>
                <span class="badge-value">{{ audit.summary.passed || 0 }}</span>
              </span>
              <span class="badge badge-error">
                <span class="badge-label">{{ t("common.fail") }}:</span>
                <span class="badge-value">{{ audit.summary.failed || 0 }}</span>
              </span>
              <span class="badge badge-warning">
                <span class="badge-label">{{ t("common.manualCheck") }}:</span>
                <span class="badge-value">{{ audit.summary.manualCheckRequired || 0 }}</span>
              </span>
            </div>

            <div class="audit-actions">
              <button
                class="btn-delete"
                :aria-label="t('history.deleteAudit', { date: formatDate(audit.timestamp) })"
                :title="t('history.delete')"
                @click.stop="deleteAudit(audit)"
                @keydown.enter.stop="deleteAudit(audit)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue"
import { useI18n } from "../composables/useI18n.js"
import { useStorage } from "../composables/useStorage.js"

const props = defineProps({
  currentUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(["close", "select"])

const { t } = useI18n()
const {
  loadURLHistory,
  deleteAudit: deleteAuditFromStorage,
  clearURLHistory,
  loadStorageInfo,
  showQuotaWarning,
  storageUsagePercent,
  isLoading,
  error
} = useStorage()

// Refs
const panelRef = ref(null)
const closeButtonRef = ref(null)
const historyListRef = ref(null)
const itemRefs = ref([])

const audits = ref([])
const selectedAudit = ref(null)
const focusedIndex = ref(-1)

const sortedAudits = computed(() => {
  return [...audits.value].sort((a, b) => b.timestamp - a.timestamp)
})

// Store item refs for keyboard navigation
function setItemRef(el, index) {
  if (el) {
    itemRefs.value[index] = el
  }
}

onMounted(async () => {
  await loadAudits()
  await loadStorageInfo()

  // Focus on close button when panel opens (trap focus)
  await nextTick()
  closeButtonRef.value?.focus()

  // Add global escape handler
  document.addEventListener("keydown", handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleGlobalKeydown)
})

// Keyboard navigation handlers
function handleGlobalKeydown(event) {
  if (event.key === "Escape") {
    emit("close")
  }
}

function handleOverlayKeydown(event) {
  if (event.key === "Tab") {
    // Trap focus within the panel
    trapFocus(event)
  }
}

function trapFocus(event) {
  const focusableElements = panelRef.value?.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusableElements?.length) return

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

function handleListKeydown(event) {
  const itemCount = sortedAudits.value.length
  if (itemCount === 0) return

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      focusedIndex.value = Math.min(focusedIndex.value + 1, itemCount - 1)
      focusItem(focusedIndex.value)
      break
    case "ArrowUp":
      event.preventDefault()
      focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
      focusItem(focusedIndex.value)
      break
    case "Home":
      event.preventDefault()
      focusedIndex.value = 0
      focusItem(0)
      break
    case "End":
      event.preventDefault()
      focusedIndex.value = itemCount - 1
      focusItem(itemCount - 1)
      break
    case "Enter":
    case " ":
      event.preventDefault()
      if (focusedIndex.value >= 0) {
        selectAudit(sortedAudits.value[focusedIndex.value], focusedIndex.value)
      }
      break
  }
}

function focusItem(index) {
  nextTick(() => {
    itemRefs.value[index]?.focus()
  })
}

async function loadAudits() {
  try {
    audits.value = await loadURLHistory(props.currentUrl)
    // Reset focus index when audits change
    focusedIndex.value = audits.value.length > 0 ? 0 : -1
  } catch (err) {
    console.error("Failed to load audits:", err)
  }
}

function selectAudit(audit, index = -1) {
  selectedAudit.value = audit
  if (index >= 0) {
    focusedIndex.value = index
  }
  emit("select", audit)
}

async function deleteAudit(audit) {
  if (!confirm(t("history.confirmDelete"))) {
    return
  }

  try {
    await deleteAuditFromStorage(props.currentUrl, audit.timestamp)
    await loadAudits()

    if (selectedAudit.value?.timestamp === audit.timestamp) {
      selectedAudit.value = null
      emit("select", null)
    }
  } catch (err) {
    console.error("Failed to delete audit:", err)
  }
}

async function handleClearHistory() {
  if (!confirm(t("history.confirmClearAll"))) {
    return
  }

  try {
    await clearURLHistory(props.currentUrl)
    audits.value = []
    selectedAudit.value = null
    comparisonAudit.value = null
    emit("select", null)
  } catch (err) {
    console.error("Failed to clear history:", err)
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  })
}
</script>

<style scoped>
.history-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.history-panel {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.history-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.history-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-clear,
.btn-close {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-clear {
  color: var(--color-error);
}

.btn-clear:hover {
  background: rgba(211, 47, 47, 0.1);
}

.btn-close {
  font-size: 1.5rem;
  color: var(--color-text-secondary);
  padding: 0.25rem 0.5rem;
}

.btn-close:hover {
  background: var(--color-bg-secondary);
}

.loading,
.error,
.empty {
  padding: 2rem;
  text-align: center;
}

.error {
  color: var(--color-error);
}

.quota-warning {
  padding: var(--space-md);
  margin: var(--space-md);
  background: rgba(255, 152, 0, 0.1);
  color: var(--color-warning);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-warning);
  font-weight: 500;
}

.empty-hint {
  margin-top: 0.5rem;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-primary);
}

.history-item.selected {
  background: rgba(25, 118, 210, 0.1);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}

.audit-info {
  flex-shrink: 0;
}

.audit-date {
  font-weight: 600;
  color: var(--color-text-primary);
}

.audit-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}

.audit-summary {
  display: flex;
  gap: 0.5rem;
  flex: 1;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  white-space: nowrap;
}

.badge-label {
  opacity: 0.85;
}

.badge-value {
  font-weight: 700;
  font-size: var(--font-size-base);
}

.badge-success {
  background: rgba(46, 125, 50, 0.15);
  color: var(--color-success);
}

.badge-error {
  background: rgba(211, 47, 47, 0.15);
  color: var(--color-error);
}

.badge-warning {
  background: rgba(255, 152, 0, 0.15);
  color: var(--color-warning);
}

.audit-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-compare,
.btn-delete {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  transition: all 0.2s;
}

.btn-compare:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-delete:hover {
  background: rgba(211, 47, 47, 0.1);
  border-color: var(--color-error);
}

.comparison-banner {
  padding: var(--space-md);
  background: rgba(25, 118, 210, 0.1);
  border-top: 1px solid var(--color-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-banner p {
  margin: 0;
  font-size: var(--font-size-sm);
}

.btn-view-comparison {
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.btn-view-comparison:hover {
  background: var(--color-primary);
  color: white;
}
</style>
