/**
 * JSON Patch (RFC 6902) Differential Engine
 * Pure functions for computing and applying deltas
 */

/**
 * Compute delta between two audit results using JSON Patch (RFC 6902)
 */
export function computeDelta(baselineAudit, newAudit) {
  const patches = []

  // Generate JSON Patch operations
  generatePatches(baselineAudit, newAudit, "", patches)

  return patches
}

/**
 * Apply delta (JSON Patch) to reconstruct full audit
 */
export function applyDelta(baselineAudit, delta) {
  // Deep clone to avoid mutation
  const result = JSON.parse(JSON.stringify(baselineAudit))

  // Apply each patch operation
  for (const patch of delta) {
    applyPatchOperation(result, patch)
  }

  return result
}

/**
 * Generate JSON Patch operations by comparing two objects
 */
function generatePatches(base, current, path, patches) {
  // Handle null/undefined
  if (base === current) return
  if (base === null || base === undefined) {
    patches.push({ op: "add", path: path || "/", value: current })
    return
  }
  if (current === null || current === undefined) {
    patches.push({ op: "remove", path: path || "/" })
    return
  }

  // Handle primitive types
  if (typeof base !== "object" || typeof current !== "object") {
    if (base !== current) {
      patches.push({ op: "replace", path: path || "/", value: current })
    }
    return
  }

  // Handle arrays
  if (Array.isArray(base) && Array.isArray(current)) {
    const maxLen = Math.max(base.length, current.length)
    for (let i = 0; i < maxLen; i++) {
      const itemPath = `${path}/${i}`
      if (i >= base.length) {
        patches.push({ op: "add", path: itemPath, value: current[i] })
      } else if (i >= current.length) {
        patches.push({ op: "remove", path: itemPath })
      } else {
        generatePatches(base[i], current[i], itemPath, patches)
      }
    }
    return
  }

  // Handle objects
  const baseKeys = Object.keys(base)
  const currentKeys = Object.keys(current)
  const allKeys = new Set([...baseKeys, ...currentKeys])

  for (const key of allKeys) {
    const propPath = `${path}/${escapeJsonPointer(key)}`
    if (!(key in base)) {
      patches.push({ op: "add", path: propPath, value: current[key] })
    } else if (!(key in current)) {
      patches.push({ op: "remove", path: propPath })
    } else {
      generatePatches(base[key], current[key], propPath, patches)
    }
  }
}

/**
 * Apply a single JSON Patch operation
 */
function applyPatchOperation(obj, patch) {
  const { op, path, value } = patch
  const parts = parseJsonPointer(path)

  if (op === "add" || op === "replace") {
    setValueAtPath(obj, parts, value)
  } else if (op === "remove") {
    removeValueAtPath(obj, parts)
  }
}

/**
 * Parse JSON Pointer path into array of keys
 */
function parseJsonPointer(path) {
  if (path === "") return []
  if (!path.startsWith("/")) throw new Error("Invalid JSON Pointer")

  return path.slice(1).split("/").map(unescapeJsonPointer)
}

/**
 * Escape special characters in JSON Pointer
 */
function escapeJsonPointer(str) {
  return String(str).replace(/~/g, "~0").replace(/\//g, "~1")
}

/**
 * Unescape special characters in JSON Pointer
 */
function unescapeJsonPointer(str) {
  return str.replace(/~1/g, "/").replace(/~0/g, "~")
}

/**
 * Set value at path in object
 */
function setValueAtPath(obj, parts, value) {
  if (parts.length === 0) {
    throw new Error("Cannot replace root")
  }

  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!(part in current)) {
      current[part] = isNaN(parts[i + 1]) ? {} : []
    }
    current = current[part]
  }

  const lastPart = parts[parts.length - 1]
  if (Array.isArray(current)) {
    const index = lastPart === "-" ? current.length : parseInt(lastPart)
    current[index] = value
  } else {
    current[lastPart] = value
  }
}

/**
 * Remove value at path in object
 */
function removeValueAtPath(obj, parts) {
  if (parts.length === 0) {
    throw new Error("Cannot remove root")
  }

  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]]
    if (current === undefined) return
  }

  const lastPart = parts[parts.length - 1]
  if (Array.isArray(current)) {
    current.splice(parseInt(lastPart), 1)
  } else {
    delete current[lastPart]
  }
}
