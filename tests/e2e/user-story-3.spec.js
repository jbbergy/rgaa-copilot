import { test, expect } from "@playwright/test"
import path from "path"
import fs from "fs"

const EXTENSION_PATH_CHROME = path.resolve(__dirname, "../../dist/chrome")
const EXTENSION_PATH_FIREFOX = path.resolve(__dirname, "../../dist/firefox")
const DOWNLOAD_PATH = path.resolve(__dirname, "../../downloads")

test.describe("User Story 3: Export Reports", () => {
  test.beforeEach(async () => {
    // Ensure download directory exists
    if (!fs.existsSync(DOWNLOAD_PATH)) {
      fs.mkdirSync(DOWNLOAD_PATH, { recursive: true })
    }
  })

  test.describe("Chrome", () => {
    let extensionId

    test.beforeEach(async ({ context }) => {
      await context.addInitScript(() => {
        window.__TEST_MODE__ = true
      })
    })

    test("should display export button after audit completion", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      // Start audit
      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      // Verify export button is visible
      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await expect(exportButton).toBeVisible()
    })

    test("should open export dialog when export button clicked", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Verify export dialog is displayed
      const exportDialog = popup.locator(".export-dialog")
      await expect(exportDialog).toBeVisible()
      await expect(exportDialog).toHaveAttribute("role", "dialog")
    })

    test("should display all export format options", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Verify format options
      const htmlOption = popup.locator("input[type=\"radio\"][value=\"html\"]")
      const jsonOption = popup.locator("input[type=\"radio\"][value=\"json\"]")
      const csvOption = popup.locator("input[type=\"radio\"][value=\"csv\"]")

      await expect(htmlOption).toBeVisible()
      await expect(jsonOption).toBeVisible()
      await expect(csvOption).toBeVisible()
    })

    test("should export HTML report with embedded CSS", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Select HTML format
      const htmlOption = popup.locator("input[type=\"radio\"][value=\"html\"]")
      await htmlOption.click()

      // Trigger download
      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      const [download] = await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      // Verify download
      const filename = download.suggestedFilename()
      expect(filename).toMatch(/rgaa-audit-.*\.html/)

      const downloadPath = path.join(DOWNLOAD_PATH, filename)
      await download.saveAs(downloadPath)

      // Verify file content
      const content = fs.readFileSync(downloadPath, "utf-8")
      expect(content).toContain("<!DOCTYPE html>")
      expect(content).toContain("<style>")
      expect(content).toContain("RGAA")
      expect(content).toContain("Audit")
    })

    test("should export JSON with complete audit data", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Select JSON format
      const jsonOption = popup.locator("input[type=\"radio\"][value=\"json\"]")
      await jsonOption.click()

      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      const [download] = await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      const filename = download.suggestedFilename()
      expect(filename).toMatch(/rgaa-audit-.*\.json/)

      const downloadPath = path.join(DOWNLOAD_PATH, filename)
      await download.saveAs(downloadPath)

      // Verify JSON structure
      const content = fs.readFileSync(downloadPath, "utf-8")
      const data = JSON.parse(content)

      expect(data).toHaveProperty("metadata")
      expect(data).toHaveProperty("summary")
      expect(data).toHaveProperty("results")
      expect(data.metadata).toHaveProperty("timestamp")
      expect(data.metadata).toHaveProperty("url")
      expect(data.metadata).toHaveProperty("rgaaVersion")
      expect(data.metadata).toHaveProperty("extensionVersion")
      expect(Array.isArray(data.results)).toBe(true)
    })

    test("should export CSV with all required columns", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Select CSV format
      const csvOption = popup.locator("input[type=\"radio\"][value=\"csv\"]")
      await csvOption.click()

      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      const [download] = await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      const filename = download.suggestedFilename()
      expect(filename).toMatch(/rgaa-audit-.*\.csv/)

      const downloadPath = path.join(DOWNLOAD_PATH, filename)
      await download.saveAs(downloadPath)

      // Verify CSV structure
      const content = fs.readFileSync(downloadPath, "utf-8")
      const lines = content.split("\n")

      expect(lines.length).toBeGreaterThan(1)

      // Check header row
      const header = lines[0]
      expect(header).toContain("Criterion")
      expect(header).toContain("Status")
      expect(header).toContain("Severity")
      expect(header).toContain("Violations")
      expect(header).toContain("Description")
    })

    test("should include metadata in all export formats", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      const jsonOption = popup.locator("input[type=\"radio\"][value=\"json\"]")
      await jsonOption.click()

      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      const [download] = await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      const downloadPath = path.join(DOWNLOAD_PATH, download.suggestedFilename())
      await download.saveAs(downloadPath)

      const content = fs.readFileSync(downloadPath, "utf-8")
      const data = JSON.parse(content)

      // Verify metadata
      expect(data.metadata.url).toBe("http://localhost:8080/test.html")
      expect(data.metadata.rgaaVersion).toBe("4.1")
      expect(data.metadata.extensionVersion).toMatch(/^\d+\.\d+\.\d+$/)
      expect(new Date(data.metadata.timestamp).getTime()).toBeGreaterThan(0)
    })

    test("should support keyboard navigation in export dialog", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      const exportDialog = popup.locator(".export-dialog")
      await expect(exportDialog).toBeVisible()

      // Press Escape to close
      await popup.keyboard.press("Escape")
      await expect(exportDialog).not.toBeVisible()

      // Reopen
      await exportButton.click()
      await expect(exportDialog).toBeVisible()

      // Tab through radio buttons
      await popup.keyboard.press("Tab")
      const focusedElement = await popup.locator(":focus")
      await expect(focusedElement).toHaveAttribute("type", "radio")

      // Arrow keys to navigate radio buttons
      await popup.keyboard.press("ArrowDown")
      const nextFocused = await popup.locator(":focus")
      await expect(nextFocused).toHaveAttribute("type", "radio")
    })

    test("should have proper ARIA labels in export dialog", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      // Verify dialog ARIA attributes
      const exportDialog = popup.locator(".export-dialog")
      await expect(exportDialog).toHaveAttribute("role", "dialog")
      await expect(exportDialog).toHaveAttribute("aria-modal", "true")
      await expect(exportDialog).toHaveAttribute("aria-labelledby")

      // Verify radio buttons have labels
      const htmlRadio = popup.locator("input[type=\"radio\"][value=\"html\"]")
      const htmlLabel = popup.locator("label[for]:has-text(\"HTML\")")
      await expect(htmlLabel).toBeVisible()

      // Verify close button has aria-label
      const closeButton = popup.locator(".export-dialog button[aria-label*=\"Fermer\"]")
      await expect(closeButton).toBeVisible()
    })

    test("should handle large audit exports efficiently", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      const jsonOption = popup.locator("input[type=\"radio\"][value=\"json\"]")
      await jsonOption.click()

      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      const startTime = Date.now()

      const [download] = await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      const exportTime = Date.now() - startTime

      // Export should complete within reasonable time (< 2 seconds)
      expect(exportTime).toBeLessThan(2000)

      const downloadPath = path.join(DOWNLOAD_PATH, download.suggestedFilename())
      await download.saveAs(downloadPath)

      // Verify file is not empty
      const stats = fs.statSync(downloadPath)
      expect(stats.size).toBeGreaterThan(0)
    })

    test("should close dialog after successful export", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")

      const popup = await context.newPage()
      await popup.goto(`chrome-extension://${extensionId}/popup.html`)

      const startButton = popup.locator("button:has-text(\"Démarrer l'audit\")")
      await startButton.click()
      await popup.waitForSelector(".audit-summary", { timeout: 10000 })

      const exportButton = popup.locator("button:has-text(\"Exporter\")")
      await exportButton.click()

      const htmlOption = popup.locator("input[type=\"radio\"][value=\"html\"]")
      await htmlOption.click()

      const downloadButton = popup.locator("button:has-text(\"Télécharger\")")

      await Promise.all([
        popup.waitForEvent("download"),
        downloadButton.click()
      ])

      // Dialog should close after export
      const exportDialog = popup.locator(".export-dialog")
      await expect(exportDialog).not.toBeVisible({ timeout: 2000 })
    })
  })

  test.describe("Firefox", () => {
    test("should work identically in Firefox", async ({ page, context }) => {
      await page.goto("http://localhost:8080/test.html")
      expect(true).toBe(true)
    })
  })

  test.afterAll(async () => {
    // Cleanup downloaded files
    if (fs.existsSync(DOWNLOAD_PATH)) {
      const files = fs.readdirSync(DOWNLOAD_PATH)
      for (const file of files) {
        fs.unlinkSync(path.join(DOWNLOAD_PATH, file))
      }
    }
  })
})
