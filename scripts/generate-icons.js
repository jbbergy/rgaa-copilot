import fs from "fs"
import { createCanvas } from "canvas"

const sizes = [16, 48, 128]
const colors = {
  primary: "#3B82F6",
  primaryDark: "#1E40AF",
  white: "#FFFFFF"
}

function drawAccessibilityIcon(ctx, size) {
  const scale = size / 128
  const center = size / 2

  // Clear canvas
  ctx.clearRect(0, 0, size, size)

  // Background circle
  ctx.fillStyle = colors.primary
  ctx.strokeStyle = colors.primaryDark
  ctx.lineWidth = 3 * scale

  ctx.beginPath()
  ctx.arc(center, center, 60 * scale, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // Accessibility symbol (white)
  ctx.fillStyle = colors.white

  // Head
  ctx.beginPath()
  ctx.arc(center, 32 * scale, 8 * scale, 0, Math.PI * 2)
  ctx.fill()

  // Body (ellipse)
  ctx.save()
  ctx.globalAlpha = 0.9
  ctx.beginPath()
  ctx.ellipse(center, 68 * scale, 18 * scale, 28 * scale, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Wheelchair wheel accent
  ctx.save()
  ctx.globalAlpha = 0.4
  ctx.strokeStyle = colors.white
  ctx.lineWidth = 3 * scale
  ctx.beginPath()
  ctx.arc(center, 90 * scale, 16 * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  ctx.save()
  ctx.globalAlpha = 0.6
  ctx.lineWidth = 2 * scale
  ctx.beginPath()
  ctx.arc(center, 90 * scale, 12 * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // RGAA text (only for larger sizes)
  if (size >= 48) {
    ctx.fillStyle = colors.white
    ctx.font = `bold ${14 * scale}px Arial, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("RGAA", center, 118 * scale)
  }

  // Checkmark accent for small size
  if (size === 16) {
    ctx.strokeStyle = colors.white
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(5, 8)
    ctx.lineTo(7, 10)
    ctx.lineTo(11, 6)
    ctx.stroke()
  }
}

async function generateIcons() {
  console.log("🎨 Génération des icônes RGAA Copilot\n")

  for (const size of sizes) {
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext("2d")

    drawAccessibilityIcon(ctx, size)

    const buffer = canvas.toBuffer("image/png")
    const filename = `public/icons/icon-${size}.png`

    fs.writeFileSync(filename, buffer)
    console.log(`✓ Créé: ${filename} (${buffer.length} bytes)`)
  }

  console.log("\n✅ Icônes générées avec succès!")
}

generateIcons().catch(console.error)
