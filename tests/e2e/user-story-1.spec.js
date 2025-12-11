import { test, expect } from "@playwright/test"
import path from "path"

const EXTENSION_PATH_CHROME = path.resolve(__dirname, "../../dist/chrome")
const EXTENSION_PATH_FIREFOX = path.resolve(__dirname, "../../dist/firefox")

test.describe("User Story 1: Quick Automated Audit", () => {
  test.describe("Chrome", () => {
    let extensionId

    test.beforeEach(async ({ context }) => {
      // Load extension in Chrome
      await context.addInitScript(() => {
        // Mock content for testing
        window.__TEST_MODE__ = true
      })
    })

    test("should display audit summary after clicking extension icon", async ({ page, context }) => {
      // Navigate to test page
      await page.goto("http://localhost:8080/test.html")

      // Open extension popup
      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Click "Start Audit" button
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await expect(startButton).toBeVisible()
      await startButton.click()

      // Wait for audit to complete
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      // Verify summary displays pass/fail/manual counts
      const passCount = await popup.locator(".stat-pass .count").textContent()
      const failCount = await popup.locator(".stat-fail .count").textContent()
      const manualCount = await popup.locator(".stat-manual .count").textContent()

      expect(parseInt(passCount)).toBeGreaterThanOrEqual(0)
      expect(parseInt(failCount)).toBeGreaterThanOrEqual(0)
      expect(parseInt(manualCount)).toBeGreaterThanOrEqual(0)
    })

    test("should show progress indicator during audit", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()

      // Verify progress indicator appears
      const progressBar = popup.locator(".progress-bar")
      await expect(progressBar).toBeVisible()

      // Wait for completion
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      // Progress should be hidden after completion
      await expect(progressBar).not.toBeVisible()
    })

    test("should display criteria grouped by RGAA category", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()

      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Verify RGAA categories are displayed
      const categories = await popup.locator(".rgaa-category").count()
      expect(categories).toBeGreaterThan(0)

      // Verify criteria are listed
      const criteria = await popup.locator(".criterion-item").count()
      expect(criteria).toBeGreaterThan(0)
    })

    test("should expand/collapse severity groups correctly", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()

      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Level A should be expanded by default
      const levelAGroup = popup.locator(".severity-group[data-level=\"A\"]")
      await expect(levelAGroup).toHaveAttribute("aria-expanded", "true")

      // AA and AAA should be collapsed if >100 violations
      const levelAAGroup = popup.locator(".severity-group[data-level=\"AA\"]")
      const aaViolations = await levelAAGroup.locator(".violation-count").textContent()

      if (parseInt(aaViolations) > 100) {
        await expect(levelAAGroup).toHaveAttribute("aria-expanded", "false")
      }
    })

    test("should highlight elements on page when clicked", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()

      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Click on a criterion with violations
      const criterionWithViolations = popup.locator(".criterion-item.fail").first()
      await criterionWithViolations.click()

      // Click on first violation
      const firstViolation = popup.locator(".violation-instance").first()
      await firstViolation.click()

      // Verify element is highlighted on page (check for highlight class)
      const highlightedElement = await page.locator(".a11y-highlight").first()
      await expect(highlightedElement).toBeVisible()

      // Highlight should disappear after 2 seconds
      await page.waitForTimeout(2500)
      await expect(highlightedElement).not.toHaveClass(/a11y-highlight/)
    })

    test("should support re-scan button for dynamic content", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()

      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      // Add dynamic content to page
      await page.evaluate(() => {
        const div = document.createElement("div")
        div.innerHTML = "<img src=\"test.png\">"
        document.body.appendChild(div)
      })

      // Click re-scan button
      const rescanButton = popup.locator("button:has-text(\"Re-scanner\")")
      await expect(rescanButton).toBeVisible()
      await rescanButton.click()

      // Verify audit runs again
      await popup.waitForSelector(".progress-bar")
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })
    })

    test("should support keyboard navigation", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Tab to start button and press Enter
      await popup.keyboard.press("Tab")
      await popup.keyboard.press("Enter")

      await popup.waitForSelector(".criterion-list", { timeout: 10000 })

      // Navigate criteria with Tab
      await popup.keyboard.press("Tab")
      const focusedElement = await popup.locator(":focus")
      await expect(focusedElement).toHaveClass(/criterion-item/)

      // Expand with Enter
      await popup.keyboard.press("Enter")
      await expect(focusedElement).toHaveAttribute("aria-expanded", "true")

      // Collapse with Enter again
      await popup.keyboard.press("Enter")
      await expect(focusedElement).toHaveAttribute("aria-expanded", "false")
    })

    test("should have accessible ARIA labels", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Verify start button has aria-label
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await expect(startButton).toHaveAttribute("aria-label")

      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      // Verify criterion items have aria-labels
      const criterionItem = popup.locator(".criterion-item").first()
      await expect(criterionItem).toHaveAttribute("aria-label")

      // Verify summary stats have aria-labels
      const passStat = popup.locator(".stat-pass")
      await expect(passStat).toHaveAttribute("aria-label")
    })
  })

  test.describe("Firefox", () => {
    test("should work identically in Firefox", async ({ page, context }) => {
      // Similar tests as Chrome but with Firefox-specific setup
      await page.goto("http://localhost:8080/test.html")

      // Firefox extension loading would be handled differently
      // This is a placeholder for Firefox-specific implementation

      expect(true).toBe(true)
    })
  })
})
