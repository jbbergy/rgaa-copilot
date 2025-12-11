/**
 * TypeScript Type Definitions
 * Shared types for the RGAA Copilot extension
 */

/**
 * Result of a complete audit session
 */
export interface AuditSession {
  timestamp: number
  pageUrl: string
  pageTitle: string
  rgaaVersion: string
  extensionVersion: string
  criteriaResults: CriterionResult[]
  summary: AuditSummary
}

/**
 * Summary statistics for an audit
 */
export interface AuditSummary {
  totalCriteria: number
  passed: number
  failed: number
  manualCheckRequired: number
  notApplicable: number
}

/**
 * Result for a single RGAA criterion
 */
export interface CriterionResult {
  criterionId: string
  criterionTitle: { fr: string; en: string }
  status: CriterionStatus
  severity: WCAGLevel
  wcagMapping: string[]
  violations: ViolationInstance[]
  explanation: { fr: string; en: string }
  automated: boolean
}

/**
 * Status of a criterion test
 */
export type CriterionStatus = "pass" | "fail" | "manual" | "not-applicable"

/**
 * WCAG conformance level
 */
export type WCAGLevel = "A" | "AA" | "AAA"

/**
 * Single instance of a criterion violation
 */
export interface ViolationInstance {
  element: string // CSS selector
  html: string // Sanitized HTML snippet
  lineNumber?: number
  message: { fr: string; en: string }
  remediation: { fr: string; en: string }
}

/**
 * User configuration preferences
 */
export interface AuditConfiguration {
  preferredLanguage: "fr" | "en"
  highlightColor: string
  exportFormatDefault: "html" | "json" | "csv"
  storageLimit: number
}

/**
 * Reference to official RGAA documentation
 */
export interface DocumentationReference {
  criterionId: string
  frenchUrl: string
  englishUrl: string
  wcagTechniques: string[]
}

/**
 * Message types for extension communication
 */
export interface Message {
  type: string
  payload?: any
}

export interface StartAuditMessage extends Message {
  type: "START_AUDIT"
}

export interface AuditProgressMessage extends Message {
  type: "AUDIT_PROGRESS"
  payload: {
    current: number
    total: number
    criterionId: string
  }
}

export interface AuditCompleteMessage extends Message {
  type: "AUDIT_COMPLETE"
  payload: AuditSession
}

export interface HighlightElementMessage extends Message {
  type: "HIGHLIGHT_ELEMENT"
  payload: {
    selector: string
    scrollIntoView: boolean
  }
}
