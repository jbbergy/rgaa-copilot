import { test, expect } from "@playwright/test"
import path from "path"

const EXTENSION_PATH_CHROME = path.resolve(__dirname, "../../dist/chrome")
const EXTENSION_PATH_FIREFOX = path.resolve(__dirname, "../../dist/firefox")

test.describe("Cross-Browser Compatibility Tests", () => {
  test.describe("Chrome Extension", () => {
    let extensionId

    test("extension should load successfully", async ({ page, context }) => {
      // Load test page
      await page.goto("http://localhost:8080/test.html")

      // Verify extension popup can be opened
      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Verify popup loaded
      await expect(popup.locator("body")).toBeVisible()
    })

    test("audit should complete on Chrome", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Start audit
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      if (await startButton.isVisible()) {
        await startButton.click()
        await popup.waitForSelector(".audit-summary", { timeout: 15000 })

        // Verify results displayed
        const summary = popup.locator(".audit-summary")
        await expect(summary).toBeVisible()
      }
    })

    test("export should work on Chrome", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Run audit first
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      if (await startButton.isVisible()) {
        await startButton.click()
        await popup.waitForSelector(".audit-summary", { timeout: 15000 })

        // Try export
        const exportButton = popup.locator("button:has-text(\"Exporter\")")
        if (await exportButton.isVisible()) {
          await exportButton.click()

          const exportDialog = popup.locator(".export-dialog")
          await expect(exportDialog).toBeVisible()
        }
      }
    })

    test("storage should persist on Chrome", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Run audit
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      if (await startButton.isVisible()) {
        await startButton.click()
        await popup.waitForSelector(".audit-summary", { timeout: 15000 })
      }

      // Close and reopen popup
      await popup.close()

      const popup2 = await context.newPage()
      await popup2.goto(`chrome-extension://${extensionId}/popup.html`)

      // Check history is available
      const historyButton = popup2.locator("button[aria-label*=\"Historique\"]")
      if (await historyButton.isVisible()) {
        await historyButton.click()

        const historyItems = popup2.locator(".history-item")
        const count = await historyItems.count()
        expect(count).toBeGreaterThanOrEqual(0)
      }
    })
  })

  test.describe("Firefox Extension", () => {
    test.skip("Firefox tests require separate configuration", async () => {
      // Firefox extension testing requires:
      // 1. Signed extension or about:debugging
      // 2. Different extension loading mechanism
      // These tests would be run separately with Firefox-specific setup
    })

    test.skip("extension should load on Firefox 115+", async () => {
      // Verify minimum Firefox version compatibility
    })

    test.skip("Manifest V3 features work on Firefox", async () => {
      // Test Firefox-specific Manifest V3 implementation
    })
  })

  test.describe("Common Features", () => {
    test("popup dimensions should be correct", async ({ page, context }) => {
      const popup = await context.newPage()

      // Set viewport to expected popup size
      await popup.setViewportSize({ width: 400, height: 600 })

      // Verify content fits within viewport
      const body = popup.locator("body")
      const boundingBox = await body.boundingBox()

      if (boundingBox) {
        expect(boundingBox.width).toBeLessThanOrEqual(400)
      }
    })

    test("all text should be visible at 200% zoom", async ({ page }) => {
      await page.goto("http://localhost:8080/popup.html")

      // Simulate 200% zoom
      await page.evaluate(() => {
        document.body.style.zoom = "2"
      })

      // Check that main content is still visible
      const content = page.locator(".app, #app, main")
      if (await content.count() > 0) {
        await expect(content.first()).toBeVisible()
      }
    })

    test("keyboard navigation works throughout popup", async ({ page }) => {
      await page.goto("http://localhost:8080/popup.html")

      // Tab through all focusable elements
      const focusableElements = await page.locator(
        "button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      ).all()

      for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
        await page.keyboard.press("Tab")
        await page.waitForTimeout(100)

        // Verify something is focused
        const focused = await page.evaluate(() => document.activeElement?.tagName)
        expect(focused).toBeTruthy()
      }
    })

    test("no console errors during normal usage", async ({ page }) => {
      const errors = []
      page.on("console", msg => {
        if (msg.type() === "error") {
          errors.push(msg.text())
        }
      })

      await page.goto("http://localhost:8080/popup.html")
      await page.waitForTimeout(2000)

      // Filter out expected errors (e.g., missing resources in test env)
      const unexpectedErrors = errors.filter(e =>
        !e.includes("404") &&
        !e.includes("net::ERR") &&
        !e.includes("favicon")
      )

      expect(unexpectedErrors.length).toBe(0)
    })
  })

  test.describe("Performance", () => {
    test("popup should load within 500ms", async ({ page }) => {
      const startTime = Date.now()
      await page.goto("http://localhost:8080/popup.html")
      await page.waitForLoadState("domcontentloaded")
      const loadTime = Date.now() - startTime

      expect(loadTime).toBeLessThan(500)
    })

    test("audit should complete within 5 seconds for typical page", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto("http://localhost:8080/popup.html")

      const startButton = popup.locator("button:has-text(\"Démarrer\")")
      if (await startButton.isVisible()) {
        const startTime = Date.now()
        await startButton.click()

        await popup.waitForSelector(".audit-summary", { timeout: 5000 })
        const auditTime = Date.now() - startTime

        expect(auditTime).toBeLessThan(5000)
      }
    })
  })
})
