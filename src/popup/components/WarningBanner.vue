<template>
  <div
    v-if="visible"
    class="warning-banner"
    :class="[`banner-${type}`]"
    role="alert"
    :aria-live="type === 'error' ? 'assertive' : 'polite'"
  >
    <div class="banner-icon">
      <span v-if="type === 'warning'">⚠️</span>
      <span v-else-if="type === 'error'">❌</span>
      <span v-else-if="type === 'info'">ℹ️</span>
    </div>
    <div class="banner-content">
      <strong
        v-if="title"
        class="banner-title"
      >
        {{ title }}
      </strong>
      <p class="banner-message">
        {{ message }}
      </p>
      <ul
        v-if="details && details.length > 0"
        class="banner-details"
      >
        <li
          v-for="(detail, index) in details"
          :key="index"
        >
          {{ detail }}
        </li>
      </ul>
    </div>
    <button
      v-if="dismissible"
      class="banner-dismiss"
      :aria-label="t('common.dismiss')"
      @click="dismiss"
    >
      ×
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useI18n } from "../composables/useI18n.js"

const props = defineProps({
  type: {
    type: String,
    default: "warning",
    validator: (value) => ["warning", "error", "info"].includes(value)
  },
  title: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    default: () => []
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(["dismiss"])

const { t } = useI18n()
const visible = ref(true)

function dismiss() {
  visible.value = false
  emit("dismiss")
}
</script>

<style scoped>
.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-sm);
}

.banner-warning {
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
}

.banner-error {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.banner-info {
  background-color: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.banner-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.banner-content {
  flex: 1;
  min-width: 0;
}

.banner-title {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.banner-message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.banner-details {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
  font-size: 0.8rem;
}

.banner-details li {
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.banner-dismiss {
  flex-shrink: 0;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.banner-dismiss:hover {
  opacity: 1;
}

.banner-dismiss:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .banner-warning {
    background-color: #4d4000;
    border-color: #997a00;
    color: #ffe066;
  }

  .banner-error {
    background-color: #4d1a1f;
    border-color: #993333;
    color: #ffb3b3;
  }

  .banner-info {
    background-color: #0d3d4d;
    border-color: #1a7a99;
    color: #99e6ff;
  }
}
</style>
