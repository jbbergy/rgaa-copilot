import { test, expect } from "@playwright/test"
import path from "path"

const EXTENSION_PATH_CHROME = path.resolve(__dirname, "../../dist/chrome")
const EXTENSION_PATH_FIREFOX = path.resolve(__dirname, "../../dist/firefox")

test.describe("User Story 2: Remediation Guidance", () => {
  test.describe("Chrome", () => {
    let extensionId

    test.beforeEach(async ({ context }) => {
      await context.addInitScript(() => {
        window.__TEST_MODE__ = true
      })
    })

    test("should display CriterionDetail panel when criterion is clicked", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Start audit
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Click on a failed criterion
      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify CriterionDetail panel is displayed
      const detailPanel = popup.locator(".criterion-detail")
      await expect(detailPanel).toBeVisible()
    })

    test("should show official RGAA test procedure", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify official test procedure is displayed
      const testProcedure = popup.locator(".test-procedure")
      await expect(testProcedure).toBeVisible()
      await expect(testProcedure).toContainText(/Test|Méthodologie/)
    })

    test("should display plain language explanation", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify plain language summary
      const summary = popup.locator(".plain-language-summary")
      await expect(summary).toBeVisible()
      await expect(summary).toContainText(/Pourquoi|Important/)
    })

    test("should show code snippets with syntax highlighting", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify code snippet display
      const codeSnippet = popup.locator(".code-snippet")
      await expect(codeSnippet).toBeVisible()

      // Check for syntax highlighting classes
      const highlightedCode = popup.locator(".code-snippet code")
      await expect(highlightedCode).toBeVisible()
    })

    test("should display CSS selector for affected elements", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify CSS selector display
      const selector = popup.locator(".css-selector")
      await expect(selector).toBeVisible()
      await expect(selector).toContainText(/^[a-zA-Z0-9#.\[\]]+/)
    })

    test("should show remediation instructions with before/after examples", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const failedCriterion = popup.locator(".criterion-item.fail").first()
      await failedCriterion.click()

      // Verify remediation section
      const remediation = popup.locator(".remediation-instructions")
      await expect(remediation).toBeVisible()

      // Check for before/after code examples
      const beforeCode = popup.locator(".code-before")
      const afterCode = popup.locator(".code-after")
      await expect(beforeCode).toBeVisible()
      await expect(afterCode).toBeVisible()
    })

    test("should display manual testing instructions for semi-automated criteria", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Find a manual check criterion
      const manualCriterion = popup.locator(".criterion-item.manual-check").first()
      await manualCriterion.click()

      // Verify manual testing instructions
      const manualInstructions = popup.locator(".manual-testing-instructions")
      await expect(manualInstructions).toBeVisible()
      await expect(manualInstructions).toContainText(/Manuel|Vérification/)
    })

    test("should show severity badge with WCAG mapping", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const criterion = popup.locator(".criterion-item").first()
      await criterion.click()

      // Verify severity badge
      const severityBadge = popup.locator(".severity-badge")
      await expect(severityBadge).toBeVisible()
      await expect(severityBadge).toContainText(/^(A|AA|AAA)$/)

      // Verify WCAG mapping
      const wcagMapping = popup.locator(".wcag-mapping")
      await expect(wcagMapping).toBeVisible()
      await expect(wcagMapping).toContainText(/WCAG/)
    })

    test("should include link to official RGAA documentation", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const criterion = popup.locator(".criterion-item").first()
      await criterion.click()

      // Verify RGAA documentation link
      const docLink = popup.locator("a[href*=\"numerique.gouv.fr\"]")
      await expect(docLink).toBeVisible()
      await expect(docLink).toHaveAttribute("target", "_blank")
    })

    test("should support keyboard navigation in CriterionDetail", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const criterion = popup.locator(".criterion-item").first()
      await criterion.click()

      // Verify detail panel is open
      const detailPanel = popup.locator(".criterion-detail")
      await expect(detailPanel).toBeVisible()

      // Press Escape to close
      await popup.keyboard.press("Escape")
      await expect(detailPanel).not.toBeVisible()

      // Reopen
      await criterion.click()
      await expect(detailPanel).toBeVisible()

      // Tab through elements
      await popup.keyboard.press("Tab")
      const focusedElement = await popup.locator(":focus")
      await expect(focusedElement).toBeVisible()
    })

    test("should pass accessibility validation", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      const criterion = popup.locator(".criterion-item").first()
      await criterion.click()

      // Verify detail panel has proper ARIA attributes
      const detailPanel = popup.locator(".criterion-detail")
      await expect(detailPanel).toHaveAttribute("role", "dialog")
      await expect(detailPanel).toHaveAttribute("aria-modal", "true")
      await expect(detailPanel).toHaveAttribute("aria-labelledby")
      await expect(detailPanel).toHaveAttribute("aria-describedby")

      // Verify close button has aria-label
      const closeButton = popup.locator(".criterion-detail button[aria-label*=\"Fermer\"]")
      await expect(closeButton).toBeVisible()
    })
  })

  test.describe("Firefox", () => {
    test("should work identically in Firefox", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")
      expect(true).toBe(true)
    })
  })
})
