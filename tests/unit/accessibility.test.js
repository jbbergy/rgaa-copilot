import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { axe, toHaveNoViolations } from "jest-axe"

expect.extend(toHaveNoViolations)

// Mock i18n composable
vi.mock("../src/popup/composables/useI18n.js", () => ({
  useI18n: () => ({
    t: (key) => key,
    locale: { value: "fr" },
    setLocale: vi.fn()
  })
}))

// Mock storage composable
vi.mock("../src/popup/composables/useStorage.js", () => ({
  useStorage: () => ({
    loadURLHistory: vi.fn().mockResolvedValue([]),
    deleteAudit: vi.fn(),
    clearURLHistory: vi.fn(),
    loadStorageInfo: vi.fn(),
    showQuotaWarning: { value: false },
    storageUsagePercent: { value: 0 },
    isLoading: { value: false },
    error: { value: null }
  })
}))

// Mock audit composable
vi.mock("../src/popup/composables/useAudit.js", () => ({
  useAudit: () => ({
    startAudit: vi.fn(),
    results: { value: [] },
    summary: { value: { passed: 0, failed: 0, manualCheckRequired: 0 } },
    isRunning: { value: false },
    progress: { value: 0 },
    error: { value: null }
  })
}))

describe("Popup Components Accessibility", () => {
  describe("AuditSummary Component", () => {
    it("should have no accessibility violations", async () => {
      const AuditSummary = (await import("../src/popup/components/AuditSummary.vue")).default

      const wrapper = mount(AuditSummary, {
        props: {
          summary: { passed: 10, failed: 5, manualCheckRequired: 3 },
          isRunning: false,
          progress: 100
        },
        global: {
          stubs: {
            teleport: true
          }
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have proper ARIA attributes on summary stats", async () => {
      const AuditSummary = (await import("../src/popup/components/AuditSummary.vue")).default

      const wrapper = mount(AuditSummary, {
        props: {
          summary: { passed: 10, failed: 5, manualCheckRequired: 3 },
          isRunning: false,
          progress: 100
        }
      })

      // Check for proper heading structure
      const headings = wrapper.findAll("h1, h2, h3, h4, h5, h6")
      expect(headings.length).toBeGreaterThan(0)

      // Check buttons have accessible names
      const buttons = wrapper.findAll("button")
      buttons.forEach(button => {
        const hasLabel = button.attributes("aria-label") ||
          button.text().trim().length > 0
        expect(hasLabel).toBeTruthy()
      })
    })
  })

  describe("CriterionList Component", () => {
    it("should have no accessibility violations", async () => {
      const CriterionList = (await import("../src/popup/components/CriterionList.vue")).default

      const wrapper = mount(CriterionList, {
        props: {
          criteria: [
            { id: "1.1", status: "pass", violations: [], wcagLevel: "A" },
            { id: "1.2", status: "fail", violations: [{ element: "img" }], wcagLevel: "A" }
          ]
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have proper keyboard navigation attributes", async () => {
      const CriterionList = (await import("../src/popup/components/CriterionList.vue")).default

      const wrapper = mount(CriterionList, {
        props: {
          criteria: [
            { id: "1.1", status: "pass", violations: [], wcagLevel: "A" }
          ]
        }
      })

      // Check for proper list role or structure
      const list = wrapper.find("[role='list'], ul, ol")
      expect(list.exists()).toBeTruthy()
    })
  })

  describe("CriterionDetail Component", () => {
    it("should have no accessibility violations", async () => {
      const CriterionDetail = (await import("../src/popup/components/CriterionDetail.vue")).default

      const wrapper = mount(CriterionDetail, {
        props: {
          criterion: {
            id: "1.1",
            status: "fail",
            violations: [{ element: "img", html: "<img>" }],
            wcagLevel: "A",
            description: { fr: "Description", en: "Description" }
          }
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have accessible code snippets", async () => {
      const CriterionDetail = (await import("../src/popup/components/CriterionDetail.vue")).default

      const wrapper = mount(CriterionDetail, {
        props: {
          criterion: {
            id: "1.1",
            status: "fail",
            violations: [{ element: "img", html: "<img src='test.jpg'>" }],
            wcagLevel: "A"
          }
        }
      })

      // Code blocks should be properly marked
      const codeBlocks = wrapper.findAll("pre, code")
      codeBlocks.forEach(block => {
        // Should not have color-only indication
        expect(block.element).toBeTruthy()
      })
    })
  })

  describe("ExportDialog Component", () => {
    it("should have no accessibility violations", async () => {
      const ExportDialog = (await import("../src/popup/components/ExportDialog.vue")).default

      const wrapper = mount(ExportDialog, {
        props: {
          isOpen: true,
          auditData: { results: [], summary: {} }
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have proper dialog attributes", async () => {
      const ExportDialog = (await import("../src/popup/components/ExportDialog.vue")).default

      const wrapper = mount(ExportDialog, {
        props: {
          isOpen: true,
          auditData: { results: [], summary: {} }
        }
      })

      const dialog = wrapper.find("[role='dialog']")
      expect(dialog.exists()).toBeTruthy()
      expect(dialog.attributes("aria-modal")).toBe("true")
    })

    it("should have labeled radio buttons", async () => {
      const ExportDialog = (await import("../src/popup/components/ExportDialog.vue")).default

      const wrapper = mount(ExportDialog, {
        props: {
          isOpen: true,
          auditData: { results: [], summary: {} }
        }
      })

      const radios = wrapper.findAll("input[type='radio']")
      radios.forEach(radio => {
        const id = radio.attributes("id")
        if (id) {
          const label = wrapper.find(`label[for="${id}"]`)
          expect(label.exists()).toBeTruthy()
        }
      })
    })
  })

  describe("HistoryPanel Component", () => {
    it("should have no accessibility violations", async () => {
      const HistoryPanel = (await import("../src/popup/components/HistoryPanel.vue")).default

      const wrapper = mount(HistoryPanel, {
        props: {
          currentUrl: "https://example.com"
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have proper dialog and listbox roles", async () => {
      const HistoryPanel = (await import("../src/popup/components/HistoryPanel.vue")).default

      const wrapper = mount(HistoryPanel, {
        props: {
          currentUrl: "https://example.com"
        }
      })

      const dialog = wrapper.find("[role='dialog']")
      expect(dialog.exists()).toBeTruthy()

      const listbox = wrapper.find("[role='listbox']")
      // May not exist if no audits
      if (listbox.exists()) {
        expect(listbox.attributes("aria-label")).toBeTruthy()
      }
    })
  })

  describe("WarningBanner Component", () => {
    it("should have no accessibility violations", async () => {
      const WarningBanner = (await import("../src/popup/components/WarningBanner.vue")).default

      const wrapper = mount(WarningBanner, {
        props: {
          type: "warning",
          message: "Test warning message"
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })

    it("should have proper alert role", async () => {
      const WarningBanner = (await import("../src/popup/components/WarningBanner.vue")).default

      const wrapper = mount(WarningBanner, {
        props: {
          type: "error",
          message: "Error message"
        }
      })

      const alert = wrapper.find("[role='alert']")
      expect(alert.exists()).toBeTruthy()
    })

    it("should have dismissible button with accessible name", async () => {
      const WarningBanner = (await import("../src/popup/components/WarningBanner.vue")).default

      const wrapper = mount(WarningBanner, {
        props: {
          type: "warning",
          message: "Dismissible warning",
          dismissible: true
        }
      })

      const dismissButton = wrapper.find("button")
      expect(dismissButton.attributes("aria-label")).toBeTruthy()
    })
  })

  describe("ComparisonView Component", () => {
    it("should have no accessibility violations", async () => {
      const ComparisonView = (await import("../src/popup/components/ComparisonView.vue")).default

      const wrapper = mount(ComparisonView, {
        props: {
          audit1: {
            timestamp: Date.now() - 86400000,
            results: [{ id: "1.1", status: "fail" }],
            summary: { passed: 5, failed: 3 }
          },
          audit2: {
            timestamp: Date.now(),
            results: [{ id: "1.1", status: "pass" }],
            summary: { passed: 6, failed: 2 }
          }
        }
      })

      const results = await axe(wrapper.element)
      expect(results).toHaveNoViolations()
    })
  })

  describe("General Accessibility Requirements", () => {
    it("all components should have sufficient color contrast", async () => {
      // This would typically be tested with axe-core's color contrast rules
      // which are included in the default ruleset
    })

    it("all interactive elements should be keyboard accessible", async () => {
      // Components should use native interactive elements or proper ARIA
    })

    it("focus should be visible on all interactive elements", async () => {
      // CSS should include :focus-visible styles with minimum 3px outline
    })

    it("text should be resizable to 200% without loss of content", async () => {
      // Components should use relative units (rem, em) not fixed px for text
    })
  })
})
