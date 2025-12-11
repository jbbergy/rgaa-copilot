<template>
  <div
    class="help-overlay"
    @click.self="closeHelp"
  >
    <div
      ref="helpDialogRef"
      class="help-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'help-title'"
      @keydown="handleKeydown"
    >
      <div class="help-header">
        <h2 id="help-title">
          {{ t("help.title") }}
        </h2>
        <button
          ref="closeButtonRef"
          class="close-button"
          :aria-label="t('common.close')"
          @click="closeHelp"
        >
          ×
        </button>
      </div>

      <div class="help-content">
        <!-- Keyboard Shortcuts Section (T265) -->
        <section class="help-section">
          <h3>{{ t("help.keyboardShortcuts") }}</h3>
          <table class="shortcuts-table">
            <thead>
              <tr>
                <th scope="col">
                  {{ t("help.key") }}
                </th>
                <th scope="col">
                  {{ t("help.action") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Escape</kbd></td>
                <td>{{ t("help.shortcuts.escape") }}</td>
              </tr>
              <tr>
                <td><kbd>Tab</kbd></td>
                <td>{{ t("help.shortcuts.tab") }}</td>
              </tr>
              <tr>
                <td><kbd>Enter</kbd> / <kbd>Space</kbd></td>
                <td>{{ t("help.shortcuts.activate") }}</td>
              </tr>
              <tr>
                <td><kbd>↑</kbd> / <kbd>↓</kbd></td>
                <td>{{ t("help.shortcuts.navigate") }}</td>
              </tr>
              <tr>
                <td><kbd>Home</kbd></td>
                <td>{{ t("help.shortcuts.home") }}</td>
              </tr>
              <tr>
                <td><kbd>End</kbd></td>
                <td>{{ t("help.shortcuts.end") }}</td>
              </tr>
              <tr>
                <td><kbd>Page Up</kbd> / <kbd>Page Down</kbd></td>
                <td>{{ t("help.shortcuts.pageUpDown") }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <!-- About Section -->
        <section class="help-section">
          <h3>{{ t("help.about") }}</h3>
          <p>{{ t("help.description") }}</p>
          <dl class="version-info">
            <dt>{{ t("help.version") }}</dt>
            <dd>0.1.0</dd>
            <dt>{{ t("help.rgaaVersion") }}</dt>
            <dd>RGAA 4.1</dd>
          </dl>
        </section>

        <!-- Support Links -->
        <section class="help-section">
          <h3>{{ t("help.resources") }}</h3>
          <ul class="resources-list">
            <li>
              <a
                href="https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t("help.rgaaReference") }}
                <span
                  class="external-icon"
                  aria-hidden="true"
                >↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.w3.org/WAI/WCAG21/quickref/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ t("help.wcagQuickref") }}
                <span
                  class="external-icon"
                  aria-hidden="true"
                >↗</span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from "vue"
import { useI18n } from "../composables/useI18n.js"

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(["close"])

const { t } = useI18n()

const helpDialogRef = ref(null)
const closeButtonRef = ref(null)

// Focus close button when dialog opens
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      closeButtonRef.value?.focus()
    })
  }
})

function closeHelp() {
  emit("close")
}

// T243: Focus trap implementation
function handleKeydown(event) {
  if (event.key === "Escape") {
    closeHelp()
    return
  }

  if (event.key === "Tab") {
    const focusable = helpDialogRef.value?.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"
    )
    if (!focusable || focusable.length === 0) return

    const firstEl = focusable[0]
    const lastEl = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault()
      lastEl.focus()
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault()
      firstEl.focus()
    }
  }
}
</script>

<style scoped>
.help-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.help-dialog {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 450px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.help-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  line-height: 1;
  border-radius: var(--radius-sm);
}

.close-button:hover,
.close-button:focus {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.close-button:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.help-content {
  padding: var(--space-md);
  overflow-y: auto;
  flex: 1;
}

.help-section {
  margin-bottom: var(--space-lg);
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h3 {
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-xs);
}

.shortcuts-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.shortcuts-table th,
.shortcuts-table td {
  text-align: left;
  padding: var(--space-xs) var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.shortcuts-table th {
  font-weight: 600;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary);
}

kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: var(--font-family-mono, monospace);
  font-size: var(--font-size-xs);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xs);
  box-shadow: 0 1px 0 var(--color-border);
}

.version-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
}

.version-info dt {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.version-info dd {
  margin: 0;
}

.resources-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resources-list li {
  margin-bottom: var(--space-xs);
}

.resources-list a {
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.resources-list a:hover,
.resources-list a:focus {
  text-decoration: underline;
}

.resources-list a:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.external-icon {
  font-size: var(--font-size-xs);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .help-overlay {
    background: rgba(0, 0, 0, 0.7);
  }

  kbd {
    background: var(--color-bg-secondary);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {

  .help-overlay,
  .help-dialog {
    animation: none;
  }
}

/* High contrast */
@media (prefers-contrast: more) {
  .help-dialog {
    border: 3px solid var(--color-border);
  }

  kbd {
    border-width: 2px;
  }

  .shortcuts-table th,
  .shortcuts-table td {
    border-width: 2px;
  }
}
</style>
