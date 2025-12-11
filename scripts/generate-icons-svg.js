/**
 * Générateur d'icônes RGAA Copilot
 * Crée des icônes PNG optimisées pour Chrome et Firefox
 * Sans dépendances externes - utilise uniquement Node.js core
 */

import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// SVG optimisé pour chaque taille
const generateSVG = (size) => {
  const scale = size / 128
  const strokeWidth = Math.max(1, Math.round(2 * scale))
  const fontSize = Math.max(8, Math.round(14 * scale))

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <circle cx="${size / 2}" cy="${size / 2}" r="${60 * scale}" fill="#3B82F6" stroke="#1E40AF" stroke-width="${strokeWidth}"/>
  <g fill="#FFFFFF">
    <circle cx="${size / 2}" cy="${32 * scale}" r="${8 * scale}"/>
    <ellipse cx="${size / 2}" cy="${68 * scale}" rx="${18 * scale}" ry="${28 * scale}" opacity="0.9"/>
    <circle cx="${size / 2}" cy="${90 * scale}" r="${16 * scale}" fill="none" stroke="#FFFFFF" stroke-width="${strokeWidth}" opacity="0.4"/>
    <circle cx="${size / 2}" cy="${90 * scale}" r="${12 * scale}" fill="none" stroke="#FFFFFF" stroke-width="${Math.max(1, strokeWidth - 1)}" opacity="0.6"/>
  </g>
  ${size >= 48 ? `<text x="${size / 2}" y="${118 * scale}" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#FFFFFF" text-anchor="middle">RGAA</text>` : ""}
</svg>`
}

console.log("🎨 Génération des icônes RGAA Copilot")
console.log("📝 Création de fichiers SVG optimisés pour conversion\n")

const sizes = [16, 48, 128]
const iconsDir = join(__dirname, "..", "public", "icons")

// Créer les SVG pour chaque taille
for (const size of sizes) {
  const svg = generateSVG(size)
  const svgPath = join(iconsDir, `icon-${size}.svg`)

  fs.writeFileSync(svgPath, svg)
  console.log(`✓ Créé: icon-${size}.svg (${svg.length} bytes)`)
}

console.log("\n📌 SVG créés. Pour générer les PNG:")
console.log("\nOption 1 - En ligne (Rapide):")
console.log("  1. Ouvrir https://cloudconvert.com/svg-to-png")
console.log("  2. Uploader les 3 fichiers SVG depuis public/icons/")
console.log("  3. Télécharger les PNG et les placer dans public/icons/")
console.log("\nOption 2 - Inkscape (Local):")
console.log("  powershell -ExecutionPolicy Bypass -File generate-icons.ps1")
console.log("\nOption 3 - Extension VSCode:")
console.log("  Installer 'SVG' extension, ouvrir chaque SVG, exporter en PNG")

// Créer aussi un SVG master pour référence
const masterSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563EB;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="url(#bgGradient)" stroke="#1E40AF" stroke-width="3"/>
  <g fill="#FFFFFF">
    <circle cx="64" cy="32" r="8"/>
    <ellipse cx="64" cy="68" rx="18" ry="28" opacity="0.9"/>
    <circle cx="64" cy="90" r="16" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.4"/>
    <circle cx="64" cy="90" r="12" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
  </g>
  <text x="64" y="118" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#FFFFFF" text-anchor="middle">RGAA</text>
</svg>`

fs.writeFileSync(join(iconsDir, "icon-master.svg"), masterSVG)
console.log("\n✓ icon-master.svg créé pour référence design")
