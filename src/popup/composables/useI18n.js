/**
 * useI18n Composable
 * Manages internationalization (French/English)
 */

import { ref, computed } from "vue"
import frTranslations from "@/shared/data/i18n/fr.json"
import enTranslations from "@/shared/data/i18n/en.json"

// Français par défaut car RGAA est une norme française
const currentLanguage = ref("fr")

const translations = {
  fr: frTranslations,
  en: enTranslations
}

export function useI18n() {
  /**
   * Get translation for a key using dot notation
   * Supports parameter interpolation: t("key", { param: "value" })
   */
  function t(key, params = {}) {
    const keys = key.split(".")
    let value = translations[currentLanguage.value]

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k]
      } else {
        return key // Return key if not found
      }
    }

    let result = value || key

    // Replace parameters in the string
    if (typeof result === "string" && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`\\{${param}\\}`, "g"), params[param])
      })
    }

    return result
  }

  /**
   * Switch language
   */
  function switchLanguage(lang) {
    if (lang === "fr" || lang === "en") {
      currentLanguage.value = lang
    }
  }

  const language = computed(() => currentLanguage.value)

  return {
    t,
    language,
    switchLanguage
  }
}
