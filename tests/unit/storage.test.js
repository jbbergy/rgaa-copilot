/**
 * @vitest-environment node
 */
import { describe, it, expect, beforeEach } from "vitest"
import { computeDelta, applyDelta } from "../../src/shared/utils/diff-engine.js"

describe("Differential Storage", () => {
  describe("computeDelta", () => {
    it("should compute delta for changed properties", () => {
      const base = {
        url: "https://example.com",
        timestamp: 1000,
        summary: { pass: 50, fail: 5, manualCheck: 51 },
        results: [
          { id: "1.1", status: "fail", violations: 2 },
          { id: "3.2", status: "pass", violations: 0 }
        ]
      }

      const current = {
        url: "https://example.com",
        timestamp: 2000,
        summary: { pass: 52, fail: 3, manualCheck: 51 },
        results: [
          { id: "1.1", status: "pass", violations: 0 },
          { id: "3.2", status: "pass", violations: 0 }
        ]
      }

      const delta = computeDelta(base, current)

      expect(delta).toBeDefined()
      expect(delta.length).toBeGreaterThan(0)
      expect(delta[0]).toHaveProperty("op")
      expect(delta[0]).toHaveProperty("path")
    })

    it("should return empty delta for identical objects", () => {
      const obj = {
        url: "https://example.com",
        summary: { pass: 50, fail: 5 }
      }

      const delta = computeDelta(obj, obj)

      expect(delta).toEqual([])
    })

    it("should handle array changes", () => {
      const base = {
        results: [
          { id: "1.1", status: "fail" },
          { id: "3.2", status: "pass" }
        ]
      }

      const current = {
        results: [
          { id: "1.1", status: "pass" },
          { id: "3.2", status: "pass" },
          { id: "8.2", status: "fail" }
        ]
      }

      const delta = computeDelta(base, current)

      expect(delta.length).toBeGreaterThan(0)
    })

    it("should handle nested object changes", () => {
      const base = {
        summary: {
          pass: 50,
          fail: 5,
          details: { critical: 2, minor: 3 }
        }
      }

      const current = {
        summary: {
          pass: 52,
          fail: 3,
          details: { critical: 1, minor: 2 }
        }
      }

      const delta = computeDelta(base, current)

      expect(delta.length).toBeGreaterThan(0)
    })
  })

  describe("applyDelta", () => {
    it("should reconstruct object from base and delta", () => {
      const base = {
        url: "https://example.com",
        timestamp: 1000,
        summary: { pass: 50, fail: 5 }
      }

      const delta = [
        { op: "replace", path: "/timestamp", value: 2000 },
        { op: "replace", path: "/summary/pass", value: 52 },
        { op: "replace", path: "/summary/fail", value: 3 }
      ]

      const result = applyDelta(base, delta)

      expect(result.timestamp).toBe(2000)
      expect(result.summary.pass).toBe(52)
      expect(result.summary.fail).toBe(3)
      expect(result.url).toBe("https://example.com")
    })

    it("should handle add operations", () => {
      const base = {
        summary: { pass: 50, fail: 5 }
      }

      const delta = [
        { op: "add", path: "/summary/manualCheck", value: 51 }
      ]

      const result = applyDelta(base, delta)

      expect(result.summary.manualCheck).toBe(51)
    })

    it("should handle remove operations", () => {
      const base = {
        summary: { pass: 50, fail: 5, deprecated: true }
      }

      const delta = [
        { op: "remove", path: "/summary/deprecated" }
      ]

      const result = applyDelta(base, delta)

      expect(result.summary.deprecated).toBeUndefined()
    })

    it("should handle array operations", () => {
      const base = {
        results: [{ id: "1.1" }, { id: "3.2" }]
      }

      const delta = [
        { op: "add", path: "/results/2", value: { id: "8.2" } }
      ]

      const result = applyDelta(base, delta)

      expect(result.results.length).toBe(3)
      expect(result.results[2].id).toBe("8.2")
    })

    it("should not mutate original object", () => {
      const base = {
        summary: { pass: 50, fail: 5 }
      }

      const delta = [
        { op: "replace", path: "/summary/pass", value: 52 }
      ]

      const result = applyDelta(base, delta)

      expect(base.summary.pass).toBe(50)
      expect(result.summary.pass).toBe(52)
    })

    it("should handle complex nested changes", () => {
      const base = {
        results: [
          { id: "1.1", status: "fail", violations: [{ selector: "img" }] }
        ]
      }

      const delta = [
        { op: "replace", path: "/results/0/status", value: "pass" },
        { op: "replace", path: "/results/0/violations", value: [] }
      ]

      const result = applyDelta(base, delta)

      expect(result.results[0].status).toBe("pass")
      expect(result.results[0].violations).toEqual([])
    })
  })

  describe("Storage optimization", () => {
    it("should produce smaller delta than full object", () => {
      const base = {
        url: "https://example.com",
        timestamp: 1000,
        summary: { pass: 50, fail: 5, manualCheck: 51, notApplicable: 0 },
        results: Array(100).fill(null).map((_, i) => ({
          id: `${i}.1`,
          status: "pass",
          violations: []
        }))
      }

      const current = {
        ...base,
        timestamp: 2000,
        summary: { ...base.summary, pass: 52, fail: 3 },
        results: base.results.map((r, i) =>
          i === 0 ? { ...r, status: "pass" } : r
        )
      }

      const delta = computeDelta(base, current)
      const baseSize = JSON.stringify(base).length
      const deltaSize = JSON.stringify(delta).length

      expect(deltaSize).toBeLessThan(baseSize / 2)
    })

    it("should handle same URL audits efficiently", () => {
      const audit1 = {
        url: "https://example.com",
        timestamp: 1000,
        summary: { pass: 50, fail: 10 }
      }

      const audit2 = {
        url: "https://example.com",
        timestamp: 2000,
        summary: { pass: 55, fail: 5 }
      }

      const delta = computeDelta(audit1, audit2)

      expect(delta.length).toBeLessThan(5)
    })
  })
})
