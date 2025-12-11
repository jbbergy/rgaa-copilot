<template>
  <div class="criterion-list">
    <h2>{{ t("criterion.details") }}</h2>

    <!-- T257: aria-busy during audit -->
    <div
      ref="criteriaContainerRef"
      class="criteria-container"
      role="listbox"
      :aria-label="t('criterion.listLabel')"
      tabindex="0"
      @keydown="handleListKeydown"
    >
      <!-- T237: v-memo to prevent re-renders when criterion data hasn't changed -->
      <div
        v-for="(criterion, index) in filteredCriteriaResults"
        :key="criterion.criterionId"
        v-memo="[criterion.criterionId, criterion.status, expandedCriteria.has(criterion.criterionId), focusedIndex === index]"
        :ref="el => setCriterionRef(el, index)"
        class="criterion-item"
        :class="`status-${criterion.status}`"
        role="option"
        :aria-selected="expandedCriteria.has(criterion.criterionId)"
        :tabindex="focusedIndex === index ? 0 : -1"
      >
        <button
          class="criterion-header"
          :aria-expanded="expandedCriteria.has(criterion.criterionId)"
          :aria-label="`${criterion.criterionId} - ${criterion.title[language]} - ${getStatusLabel(criterion.status)}`"
          :aria-current="expandedCriteria.has(criterion.criterionId) ? 'true' : undefined"
          :title="t('criterion.expandHint')"
          @click="toggleCriterion(criterion.criterionId, index)"
          @keydown.enter.prevent="toggleCriterion(criterion.criterionId, index)"
          @keydown.space.prevent="toggleCriterion(criterion.criterionId, index)"
        >
          <!-- T262: Icons provide additional visual indicators beyond color -->
          <span
            class="criterion-status-icon"
            :aria-hidden="true"
          >
            {{ getStatusIcon(criterion.status) }}
          </span>

          <span class="criterion-info">
            <span class="criterion-id">{{ criterion.criterionId }}</span>
            <span class="criterion-title">
              {{ criterion.title[language] }}
            </span>
          </span>

          <span class="criterion-badge">
            {{ criterion.level }}
          </span>

          <span
            v-if="criterion.violations && criterion.violations.length > 0"
            class="violation-count"
          >
            {{ criterion.violations.length }}
          </span>
        </button>

        <div
          v-if="expandedCriteria.has(criterion.criterionId)"
          class="criterion-details"
        >
          <p class="criterion-explanation">
            {{ criterion.explanation[language] }}
          </p>

          <button
            class="view-detail-button"
            @click="openDetailPanel(criterion)"
          >
            {{ t("criterion.details") }} →
          </button>

          <div
            v-if="criterion.violations && criterion.violations.length > 0"
            class="violations-list"
          >
            <h4>{{ t("criterion.affectedElements") }}</h4>
            <div
              v-for="(violation, vIndex) in criterion.violations.slice(0, 10)"
              :key="vIndex"
              class="violation-item"
            >
              <button
                class="violation-element"
                :title="violation.element"
                @click="highlightElement(violation.element)"
              >
                <span class="element-icon">📍</span>
                <span class="element-tag">{{ formatElementDisplay(violation.element) }}</span>
                <span
                  v-if="formatElementDisplay(violation.element) !== violation.element"
                  class="element-selector-hint"
                >
                  {{ truncate(violation.element, 30) }}
                </span>
              </button>
              <p class="violation-message">
                {{ violation.message[language] }}
              </p>
            </div>
            <p
              v-if="criterion.violations.length > 10"
              class="more-violations"
            >
              + {{ criterion.violations.length - 10 }} {{ t("criterion.moreViolations") || "autres éléments..." }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- T235: Lazy loaded CriterionDetail component -->
    <Suspense v-if="selectedCriterion">
      <CriterionDetail
        :criterion="selectedCriterion"
        @close="closeDetailPanel"
        @highlight="highlightElement"
      />
      <template #fallback>
        <div class="loading-detail">{{ t("common.loading") }}</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, nextTick, defineAsyncComponent } from "vue"
import { useAudit } from "../composables/useAudit.js"
import { useI18n } from "../composables/useI18n.js"

// T235: Lazy load CriterionDetail component on first expansion
const CriterionDetail = defineAsyncComponent(() =>
  import("./CriterionDetail.vue")
)

const { filteredCriteriaResults, highlightElement } = useAudit()
const { t, language } = useI18n()

const expandedCriteria = ref(new Set())
const selectedCriterion = ref(null)
const criteriaContainerRef = ref(null)
const criterionRefs = ref([])

// T246: Roving tabindex state
const focusedIndex = ref(0)

// Store criterion refs for keyboard navigation
function setCriterionRef(el, index) {
  if (el) {
    criterionRefs.value[index] = el
  }
}

function toggleCriterion(id, index) {
  if (expandedCriteria.value.has(id)) {
    expandedCriteria.value.delete(id)
  } else {
    expandedCriteria.value.add(id)
  }
  // Update focused index
  focusedIndex.value = index
}

function openDetailPanel(criterion) {
  selectedCriterion.value = criterion
}

// T245: Return focus to expanded criterion when closing detail panel
function closeDetailPanel() {
  const criterionId = selectedCriterion.value?.criterionId
  selectedCriterion.value = null

  // Find the index of the criterion and focus it
  nextTick(() => {
    const index = filteredCriteriaResults.value.findIndex(c => c.criterionId === criterionId)
    if (index >= 0 && criterionRefs.value[index]) {
      const button = criterionRefs.value[index].querySelector(".criterion-header")
      button?.focus()
    }
  })
}

function getStatusIcon(status) {
  const icons = {
    pass: "✓",
    fail: "✗",
    manual: "⚠",
    "not-applicable": "—"
  }
  return icons[status] || "?"
}

function getStatusLabel(status) {
  const labels = {
    pass: t("criterion.passed"),
    fail: t("criterion.failed"),
    manual: t("criterion.manualCheck"),
    "not-applicable": t("criterion.notApplicable")
  }
  return labels[status] || status
}

/**
 * Truncate text intelligently for better readability
 */
function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text

  // For CSS selectors, try to keep meaningful parts
  if (text.includes(">") || text.includes(".") || text.includes("#")) {
    // Keep the last meaningful selector part
    const parts = text.split(/\s*>\s*/)
    if (parts.length > 2) {
      const lastParts = parts.slice(-2).join(" > ")
      if (lastParts.length <= maxLength) {
        return "... > " + lastParts
      }
    }
  }

  return text.substring(0, maxLength) + "..."
}

/**
 * Format element selector/identifier for human readability
 */
function formatElementDisplay(element) {
  if (!element) return ""

  // Extract tag name if it's a selector
  const tagMatch = element.match(/^([a-z]+)/i)
  const tagName = tagMatch ? tagMatch[1].toUpperCase() : ""

  // Extract ID if present
  const idMatch = element.match(/#([a-zA-Z0-9_-]+)/)
  const id = idMatch ? `#${idMatch[1]}` : ""

  // Extract first class if present
  const classMatch = element.match(/\.([a-zA-Z0-9_-]+)/)
  const className = classMatch ? `.${classMatch[1]}` : ""

  // Build a concise description
  if (id) {
    return `${tagName}${id}`
  } else if (className) {
    return `${tagName}${className}`
  } else if (tagName) {
    return tagName
  }

  return truncate(element, 40)
}

// T246/T250/T252: Keyboard navigation for criterion list
function handleListKeydown(event) {
  const total = filteredCriteriaResults.value.length
  if (total === 0) return

  let newIndex = focusedIndex.value

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      newIndex = Math.min(focusedIndex.value + 1, total - 1)
      break
    case "ArrowUp":
      event.preventDefault()
      newIndex = Math.max(focusedIndex.value - 1, 0)
      break
    // T250: Home/End key support
    case "Home":
      event.preventDefault()
      newIndex = 0
      break
    case "End":
      event.preventDefault()
      newIndex = total - 1
      break
    // T252: Page Up/Down support
    case "PageUp":
      event.preventDefault()
      newIndex = Math.max(focusedIndex.value - 5, 0)
      break
    case "PageDown":
      event.preventDefault()
      newIndex = Math.min(focusedIndex.value + 5, total - 1)
      break
    case "Enter":
    case " ":
      event.preventDefault()
      const criterion = filteredCriteriaResults.value[focusedIndex.value]
      if (criterion) {
        toggleCriterion(criterion.criterionId, focusedIndex.value)
      }
      return
    default:
      return
  }

  if (newIndex !== focusedIndex.value) {
    focusedIndex.value = newIndex
    // Focus the new item
    nextTick(() => {
      const button = criterionRefs.value[newIndex]?.querySelector(".criterion-header")
      button?.focus()
    })
  }
}
</script>

<style scoped>
.criterion-list {
  margin-top: var(--space-lg);
}

.criterion-list h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-lg);
  color: var(--color-text-bright);
  letter-spacing: -0.3px;
}

.criteria-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.criterion-item {
  border: none;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background: var(--color-bg-secondary);
  transition: all var(--transition-fast);
}

.criterion-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.status-pass {
  border-left: 4px solid var(--color-success);
}

.status-fail {
  border-left: 4px solid var(--color-error);
}

.status-manual {
  border-left: 4px solid var(--color-warning);
}

.criterion-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background var(--transition-fast);
}

.criterion-header:hover {
  background: var(--color-bg-hover);
}

.criterion-header:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}

.criterion-status-icon {
  font-size: 20px;
  flex-shrink: 0;
  width: 24px;
  text-align: center;
}

.criterion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.criterion-id {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.criterion-title {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
  font-weight: var(--font-weight-medium);
}

.criterion-badge {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-tertiary);
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.violation-count {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-error);
  color: var(--color-bg-primary);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.criterion-details {
  padding: 0 var(--space-lg) var(--space-lg);
  background: transparent;
}

.criterion-explanation {
  margin: 0 0 var(--space-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.view-detail-button {
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary);
  color: var(--color-primary-text);
  border: none;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-detail-button:hover {
  background: var(--color-primary-hover);
  transform: scale(1.04);
}

.view-detail-button:active {
  transform: scale(0.98);
}

.view-detail-button:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.violations-list h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-md);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.violation-item {
  padding: var(--space-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
}

.violation-element {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: "Consolas", "Monaco", monospace;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
  margin-bottom: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  width: 100%;
  text-align: left;
}

.violation-element:hover {
  background: var(--color-bg-hover);
  transform: translateX(4px);
}

.violation-element:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}

.element-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.element-tag {
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  background: var(--color-bg-primary);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.element-selector-hint {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  opacity: var(--opacity-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.violation-message {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.more-violations {
  margin: var(--space-sm) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-style: italic;
}

/* T258: Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

  .criterion-header,
  .view-detail-button,
  .violation-element,
  .criterion-item {
    transition: none;
  }

  .criterion-item:hover {
    transform: none;
  }

  .violation-element:hover {
    transform: none;
  }

  .view-detail-button:hover,
  .view-detail-button:active {
    transform: none;
  }
}

/* T236: CSS containment for criterion items */
.criterion-item {
  contain: content;
}

/* T235: Loading state for lazy loaded components */
.loading-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-lg);
  color: var(--color-text-secondary);
}

/* T259/T261: High contrast mode support */
@media (prefers-contrast: more) {
  .criterion-item {
    border-width: 3px;
    border-left-width: 6px;
  }

  .criterion-header:focus {
    outline-width: 4px;
  }

  .criterion-badge {
    border-width: 3px;
  }

  .violation-count {
    font-weight: 800;
  }

  .view-detail-button:focus {
    outline-width: 4px;
  }
}
</style>
