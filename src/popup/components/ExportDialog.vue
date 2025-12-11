<template>
  <div
    v-if="isOpen"
    class="export-dialog"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="dialogTitleId"
    @keydown.esc="closeDialog"
  >
    <!-- T243: Dialog overlay with inert support -->
    <div
      class="dialog-overlay"
      aria-hidden="true"
      @click="closeDialog"
    />

    <div
      ref="dialogPanelRef"
      class="dialog-panel"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <header class="dialog-header">
        <h2 :id="dialogTitleId">
          {{ t("export.title") }}
        </h2>
        <button
          ref="closeButtonRef"
          class="close-button"
          :aria-label="t('export.close')"
          @click="closeDialog"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </header>

      <div class="dialog-content">
        <fieldset class="format-selection">
          <legend>{{ t("export.formatLabel") }}</legend>

          <div
            class="radio-group"
            role="radiogroup"
          >
            <div class="radio-option">
              <input
                id="format-html"
                v-model="selectedFormat"
                type="radio"
                value="html"
                name="export-format"
                @keydown.enter="handleDownload"
              >
              <label for="format-html">
                <span class="format-icon">📄</span>
                <div class="format-info">
                  <strong>{{ t("export.formats.html") }}</strong>
                  <small>{{ t("export.formats.htmlDesc") }}</small>
                </div>
              </label>
            </div>

            <div class="radio-option">
              <input
                id="format-json"
                v-model="selectedFormat"
                type="radio"
                value="json"
                name="export-format"
                @keydown.enter="handleDownload"
              >
              <label for="format-json">
                <span class="format-icon">📊</span>
                <div class="format-info">
                  <strong>{{ t("export.formats.json") }}</strong>
                  <small>{{ t("export.formats.jsonDesc") }}</small>
                </div>
              </label>
            </div>

            <div class="radio-option">
              <input
                id="format-csv"
                v-model="selectedFormat"
                type="radio"
                value="csv"
                name="export-format"
                @keydown.enter="handleDownload"
              >
              <label for="format-csv">
                <span class="format-icon">📈</span>
                <div class="format-info">
                  <strong>{{ t("export.formats.csv") }}</strong>
                  <small>{{ t("export.formats.csvDesc") }}</small>
                </div>
              </label>
            </div>
          </div>
        </fieldset>

        <!-- T240: Error with assertive live region -->
        <div
          v-if="exportStatus === 'error'"
          class="error-message"
          role="alert"
          aria-live="assertive"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="exportStatus === 'exporting'"
          class="exporting-message"
          role="status"
          aria-live="polite"
        >
          <div class="spinner" />
          {{ t("export.exporting") }}
        </div>
      </div>

      <footer class="dialog-footer">
        <button
          ref="cancelButtonRef"
          class="cancel-button"
          @click="closeDialog"
        >
          {{ t("export.cancel") }}
        </button>
        <button
          ref="downloadButtonRef"
          class="download-button"
          :disabled="!selectedFormat || exportStatus === 'exporting'"
          @click="handleDownload"
        >
          {{ t("export.download") }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import { useI18n } from "../composables/useI18n"
import { generateHTMLReport } from "../../shared/utils/exporters/html-exporter"
import { generateJSONReport } from "../../shared/utils/exporters/json-exporter"
import { generateCSVReport } from "../../shared/utils/exporters/csv-exporter"

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  auditData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(["close", "export-complete"])

const { t } = useI18n()

const selectedFormat = ref("html")
const exportStatus = ref("idle")
const errorMessage = ref("")

// T243: Refs for focus trap
const dialogPanelRef = ref(null)
const closeButtonRef = ref(null)
const cancelButtonRef = ref(null)
const downloadButtonRef = ref(null)

const dialogTitleId = "export-dialog-title"

// T243: Focus trap - get all focusable elements
function getFocusableElements() {
  if (!dialogPanelRef.value) return []
  return Array.from(
    dialogPanelRef.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  )
}

// T243: Handle keyboard navigation in dialog
function handleKeydown(event) {
  if (event.key === "Tab") {
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

// T243: Focus first element when dialog opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    // Focus the close button when dialog opens
    closeButtonRef.value?.focus()
  }
})

async function handleDownload() {
  if (!selectedFormat.value || exportStatus.value === "exporting") return

  exportStatus.value = "exporting"
  errorMessage.value = ""

  try {
    let content = ""
    let filename = ""
    let mimeType = ""

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0]
    const baseFilename = `rgaa-audit-${timestamp}`

    switch (selectedFormat.value) {
      case "html":
        content = generateHTMLReport(props.auditData)
        filename = `${baseFilename}.html`
        mimeType = "text/html"
        break

      case "json":
        content = generateJSONReport(props.auditData)
        filename = `${baseFilename}.json`
        mimeType = "application/json"
        break

      case "csv":
        content = generateCSVReport(props.auditData)
        filename = `${baseFilename}.csv`
        mimeType = "text/csv"
        break

      default:
        throw new Error(`Unknown format: ${selectedFormat.value}`)
    }

    // Create blob and download
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    exportStatus.value = "success"
    emit("export-complete", { format: selectedFormat.value, filename })

    // Close dialog after short delay
    setTimeout(() => {
      closeDialog()
    }, 500)

  } catch (error) {
    console.error("Export failed:", error)
    exportStatus.value = "error"
    errorMessage.value = t("export.error") || "Export failed. Please try again."
  }
}

function closeDialog() {
  exportStatus.value = "idle"
  errorMessage.value = ""
  emit("close")
}
</script>

<style scoped>
.export-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.dialog-panel {
  position: relative;
  background: var(--color-bg-primary, #ffffff);
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  background: var(--color-bg-secondary, #f5f5f5);
}

.dialog-header h2 {
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

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.format-selection {
  border: none;
  padding: 0;
  margin: 0;
}

.format-selection legend {
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text-primary, #212121);
  margin-bottom: 1rem;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option {
  position: relative;
}

.radio-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-option label {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-bg-primary, #ffffff);
}

.radio-option label:hover {
  border-color: var(--color-primary, #1976d2);
  background: var(--color-bg-secondary, #f5f5f5);
}

.radio-option input[type="radio"]:checked+label {
  border-color: var(--color-primary, #1976d2);
  background: var(--color-bg-tertiary, #e3f2fd);
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.radio-option input[type="radio"]:focus+label {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.format-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.format-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.format-info strong {
  color: var(--color-text-primary, #212121);
  font-size: 1rem;
}

.format-info small {
  color: var(--color-text-secondary, #757575);
  font-size: 0.875rem;
  line-height: 1.4;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #ffebee;
  border-left: 4px solid #c62828;
  color: #c62828;
  border-radius: 4px;
  font-weight: 500;
}

.exporting-message {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-bg-tertiary, #e3f2fd);
  border-left: 4px solid var(--color-primary, #1976d2);
  color: var(--color-primary, #1976d2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(25, 118, 210, 0.2);
  border-top-color: var(--color-primary, #1976d2);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--color-border, #e0e0e0);
  background: var(--color-bg-secondary, #f5f5f5);
}

.cancel-button,
.download-button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.cancel-button {
  background: transparent;
  border: 2px solid var(--color-border, #e0e0e0);
  color: var(--color-text-secondary, #757575);
}

.cancel-button:hover {
  background: var(--color-bg-hover, #eeeeee);
  border-color: var(--color-border-hover, #bdbdbd);
}

.cancel-button:focus {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.download-button {
  background: var(--color-primary, #1976d2);
  border: 2px solid var(--color-primary, #1976d2);
  color: #ffffff;
}

.download-button:hover:not(:disabled) {
  background: var(--color-primary-dark, #1565c0);
  border-color: var(--color-primary-dark, #1565c0);
}

.download-button:focus {
  outline: 3px solid var(--color-focus, #1976d2);
  outline-offset: 2px;
}

.download-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .dialog-panel {
    width: 95%;
  }

  .format-info {
    font-size: 0.875rem;
  }

  .format-icon {
    font-size: 1.5rem;
  }
}

/* T258: Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

  .dialog-overlay,
  .dialog-panel,
  .close-button,
  .radio-option label,
  .cancel-button,
  .download-button {
    transition: none;
  }

  .spinner {
    animation: none;
    border-color: var(--color-primary, #1976d2);
  }
}

/* T259/T261: High contrast mode support */
@media (prefers-contrast: more) {
  .dialog-panel {
    border: 3px solid currentColor;
  }

  .close-button {
    border-width: 3px;
  }

  .close-button:focus {
    outline-width: 4px;
  }

  .radio-option label {
    border-width: 3px;
  }

  .radio-option input[type="radio"]:focus+label {
    outline-width: 4px;
  }

  .cancel-button,
  .download-button {
    border-width: 3px;
  }

  .cancel-button:focus,
  .download-button:focus {
    outline-width: 4px;
  }

  .error-message {
    border-left-width: 6px;
  }
}
</style>
