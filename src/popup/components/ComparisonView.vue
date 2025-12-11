<template>
  <div class="comparison-view">
    <div class="comparison-header">
      <h3>{{ t("history.comparison") }}</h3>
      <button
        class="btn-close"
        :aria-label="t('common.close')"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>

    <div class="comparison-info">
      <div class="audit-label">
        <span class="label">{{ t("history.baseline") }}</span>
        <div class="audit-meta">
          <strong>{{ formatDate(baseAudit.timestamp) }}</strong>
          <span class="audit-summary">
            {{ baseAudit.summary.pass }} {{ t("common.pass") }} /
            {{ baseAudit.summary.fail }} {{ t("common.fail") }}
          </span>
        </div>
      </div>

      <div class="comparison-arrow">
        →
      </div>

      <div class="audit-label">
        <span class="label">{{ t("history.current") }}</span>
        <div class="audit-meta">
          <strong>{{ formatDate(targetAudit.timestamp) }}</strong>
          <span class="audit-summary">
            {{ targetAudit.summary.pass }} {{ t("common.pass") }} /
            {{ targetAudit.summary.fail }} {{ t("common.fail") }}
          </span>
        </div>
      </div>
    </div>

    <div class="comparison-summary">
      <div
        v-if="comparison.newlyPassed > 0"
        class="change-stat improvement"
      >
        <span class="stat-icon">✓</span>
        <span class="stat-value">{{ comparison.newlyPassed }}</span>
        <span class="stat-label">{{ t("history.newlyPassed") }}</span>
      </div>

      <div
        v-if="comparison.newlyFailed > 0"
        class="change-stat regression"
      >
        <span class="stat-icon">✗</span>
        <span class="stat-value">{{ comparison.newlyFailed }}</span>
        <span class="stat-label">{{ t("history.newlyFailed") }}</span>
      </div>

      <div
        v-if="comparison.unchanged > 0"
        class="change-stat unchanged"
      >
        <span class="stat-icon">−</span>
        <span class="stat-value">{{ comparison.unchanged }}</span>
        <span class="stat-label">{{ t("history.unchanged") }}</span>
      </div>
    </div>

    <div class="criteria-comparison">
      <div
        v-for="criterion in sortedCriteria"
        :key="criterion.id"
        class="criterion-row"
        :class="criterion.changeType"
      >
        <div class="criterion-id">
          {{ criterion.id }}
        </div>

        <div class="criterion-name">
          {{ criterion.name }}
        </div>

        <div class="criterion-change">
          <span
            class="status-before"
            :class="criterion.statusBefore"
          >
            {{ t(`criterion.${criterion.statusBefore}`) }}
          </span>

          <span
            v-if="criterion.changeType !== 'unchanged'"
            class="change-arrow"
          >
            {{ criterion.changeType === "improvement" ? "→" : "→" }}
          </span>

          <span
            class="status-after"
            :class="criterion.statusAfter"
          >
            {{ t(`criterion.${criterion.statusAfter}`) }}
          </span>
        </div>

        <div class="criterion-badge">
          <span
            v-if="criterion.changeType === 'improvement'"
            class="badge badge-success"
          >
            {{ t("history.improved") }}
          </span>
          <span
            v-else-if="criterion.changeType === 'regression'"
            class="badge badge-error"
          >
            {{ t("history.regressed") }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "../composables/useI18n.js"

const props = defineProps({
  baseAudit: {
    type: Object,
    required: true
  },
  targetAudit: {
    type: Object,
    required: true
  }
})

defineEmits(["close"])

const { t } = useI18n()

const comparison = computed(() => {
  return computeComparison(props.baseAudit, props.targetAudit)
})

const sortedCriteria = computed(() => {
  const criteria = comparison.value.criteria

  // Sort by change type: improvements first, regressions, then unchanged
  const order = { improvement: 0, regression: 1, unchanged: 2 }

  return [...criteria].sort((a, b) => {
    const typeOrder = order[a.changeType] - order[b.changeType]
    if (typeOrder !== 0) return typeOrder

    // Within same change type, sort by criterion ID
    return a.id.localeCompare(b.id)
  })
})

function computeComparison(baseAudit, targetAudit) {
  const criteria = []
  let newlyPassed = 0
  let newlyFailed = 0
  let unchanged = 0

  // Assume both audits have criteriaResults arrays
  const baseResults = baseAudit.criteriaResults || []
  const targetResults = targetAudit.criteriaResults || []

  // Create map of base results for quick lookup
  const baseMap = new Map()
  baseResults.forEach(criterion => {
    baseMap.set(criterion.id, criterion)
  })

  // Compare each criterion in target audit
  targetResults.forEach(targetCriterion => {
    const baseCriterion = baseMap.get(targetCriterion.id)

    if (!baseCriterion) {
      // New criterion in target audit
      criteria.push({
        id: targetCriterion.id,
        name: targetCriterion.name,
        statusBefore: "notApplicable",
        statusAfter: targetCriterion.status,
        changeType: "unchanged"
      })
      unchanged++
      return
    }

    const statusBefore = baseCriterion.status
    const statusAfter = targetCriterion.status

    let changeType = "unchanged"

    // Determine change type
    if (statusBefore !== statusAfter) {
      if (statusBefore === "failed" && statusAfter === "passed") {
        changeType = "improvement"
        newlyPassed++
      } else if (statusBefore === "passed" && statusAfter === "failed") {
        changeType = "regression"
        newlyFailed++
      } else if (
        (statusBefore === "failed" || statusBefore === "manualCheck") &&
        statusAfter === "passed"
      ) {
        changeType = "improvement"
        newlyPassed++
      } else if (
        statusBefore === "passed" &&
        (statusAfter === "failed" || statusAfter === "manualCheck")
      ) {
        changeType = "regression"
        newlyFailed++
      } else {
        unchanged++
      }
    } else {
      unchanged++
    }

    criteria.push({
      id: targetCriterion.id,
      name: targetCriterion.name,
      statusBefore,
      statusAfter,
      changeType
    })
  })

  return {
    newlyPassed,
    newlyFailed,
    unchanged,
    criteria
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}
</script>

<style scoped>
.comparison-view {
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.comparison-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  border: none;
  background: transparent;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.btn-close:hover {
  background: var(--bg-secondary);
}

.comparison-info {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.audit-label {
  flex: 1;
}

.audit-label .label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
}

.audit-meta strong {
  display: block;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.audit-summary {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.comparison-arrow {
  font-size: 2rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.comparison-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.change-stat {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.change-stat.improvement {
  background: var(--bg-success-subtle);
}

.change-stat.regression {
  background: var(--bg-error-subtle);
}

.change-stat.unchanged {
  background: var(--bg-secondary);
}

.stat-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.change-stat.improvement .stat-icon {
  color: var(--text-success);
}

.change-stat.regression .stat-icon {
  color: var(--text-error);
}

.change-stat.unchanged .stat-icon {
  color: var(--text-secondary);
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.criteria-comparison {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.criterion-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 6px;
  border-left: 4px solid transparent;
}

.criterion-row.improvement {
  border-left-color: var(--text-success);
  background: var(--bg-success-subtle);
}

.criterion-row.regression {
  border-left-color: var(--text-error);
  background: var(--bg-error-subtle);
}

.criterion-id {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.criterion-name {
  color: var(--text-primary);
  font-size: 0.9rem;
}

.criterion-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.status-before,
.status-after {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.status-before.passed,
.status-after.passed {
  background: var(--bg-success-subtle);
  color: var(--text-success);
}

.status-before.failed,
.status-after.failed {
  background: var(--bg-error-subtle);
  color: var(--text-error);
}

.status-before.manualCheck,
.status-after.manualCheck {
  background: var(--bg-warning-subtle);
  color: var(--text-warning);
}

.status-before.notApplicable,
.status-after.notApplicable {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.change-arrow {
  color: var(--text-secondary);
}

.criterion-badge .badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success {
  background: var(--text-success);
  color: white;
}

.badge-error {
  background: var(--text-error);
  color: white;
}
</style>
