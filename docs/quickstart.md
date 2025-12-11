# RGAA Copilot - Quick Start Guide

## 🚀 Getting Started

### Installation

#### Firefox

1. Download the extension `.xpi` file
2. Open Firefox and navigate to `about:addons`
3. Click the gear icon ⚙️ and select "Install Add-on From File..."
4. Select the downloaded `.xpi` file

#### Chrome

1. Download and extract the extension `.zip` file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extracted folder

### First Audit

1. **Navigate to the page** you want to audit
2. **Click the extension icon** in your browser toolbar
3. **Click "Start Audit"** (Démarrer l'audit)
4. **Wait for results** - the progress bar shows completion status
5. **Review findings** grouped by RGAA criterion

## 📊 Understanding Results

### Status Types

| Status    | Icon   | Meaning                      |
| --------- | ------ | ---------------------------- |
| ✅ Pass   | Green  | Criterion fully met          |
| ❌ Fail   | Red    | Violations detected          |
| ⚠️ Manual | Yellow | Requires manual verification |

### WCAG Levels

- **Level A** - Essential accessibility (most critical)
- **Level AA** - Standard accessibility (recommended)
- **Level AAA** - Enhanced accessibility (optimal)

## 🔍 Viewing Violation Details

1. Click on any criterion to expand details
2. View the **problematic HTML code**
3. Read the **remediation guidance**
4. Click **"Highlight"** to locate elements on the page

## 📤 Exporting Reports

1. Complete an audit
2. Click **"Export"** (Exporter)
3. Choose format:
   - **HTML** - Standalone report with styling
   - **JSON** - Machine-readable data
   - **CSV** - Spreadsheet compatible
4. Click **"Download"**

## 📜 Viewing History

1. Click the **History** button (Historique)
2. View past audits for the current URL
3. Click an audit to view its results
4. **Compare** two audits to track progress

## ⌨️ Keyboard Navigation

| Key         | Action                      |
| ----------- | --------------------------- |
| `Tab`       | Move between elements       |
| `Enter`     | Activate button/expand item |
| `Escape`    | Close dialogs               |
| `Arrow ↑/↓` | Navigate lists              |
| `Home/End`  | Jump to first/last item     |

## 🌍 Language Settings

The extension supports:

- 🇫🇷 French (Français)
- 🇬🇧 English

Click the language toggle in the popup to switch.

## 🔒 Privacy

- **No network requests** - All auditing is done locally
- **Local storage only** - Data never leaves your browser
- **No tracking** - We don't collect any usage data

## ❓ Troubleshooting

### Audit Not Starting

- Refresh the page and try again
- Check that the page has fully loaded
- Ensure JavaScript is enabled

### Missing Results

- Some criteria require manual verification
- Iframes with cross-origin content cannot be audited
- Dynamically loaded content may need a re-scan

### Extension Not Loading

- Verify browser version (Firefox 115+ or Chrome 120+)
- Check that the extension is enabled
- Try reinstalling the extension

## 📚 Reference

- [RGAA 4.1.2 Official Documentation](https://accessibilite.numerique.gouv.fr/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 💬 Support

For issues or feature requests, please file an issue on the project repository.

---

_RGAA Auditor v0.1.0 - Built for accessibility professionals_
