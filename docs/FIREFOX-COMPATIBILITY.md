# Firefox Compatibility Guide

## Vue d'ensemble

L'extension RGAA Auditor est entièrement compatible avec Firefox (version 115+) et Chrome (version 120+). Cette compatibilité est assurée par une architecture cross-browser utilisant WebExtension Manifest V3 et le polyfill `webextension-polyfill`.

## Architecture Cross-Browser

### 1. Génération Dynamique du Manifest

Le fichier `vite.config.js` génère automatiquement le bon manifest selon le navigateur cible :

```javascript
background: isFirefox
  ? { scripts: ["src/background/service-worker.js"] }
  : { service_worker: "src/background/service-worker.js" }
```

**Firefox** : Utilise `scripts` array pour le background script
**Chrome** : Utilise `service_worker` string pour le service worker

### 2. WebExtension Polyfill

Tous les fichiers JavaScript utilisent `webextension-polyfill` pour garantir la compatibilité :

```javascript
import browser from "webextension-polyfill"

// Au lieu de :
chrome.runtime.sendMessage(...)

// Nous utilisons :
browser.runtime.sendMessage(...)
```

Cela fonctionne de manière identique dans Firefox et Chrome.

### 3. Scripts de Build Dédiés

```bash
npm run build:firefox  # Build optimisé pour Firefox
npm run build:chrome   # Build optimisé pour Chrome
```

Les builds sont placés dans des dossiers séparés :

- `dist/firefox/` - Version Firefox
- `dist/chrome/` - Version Chrome

## Installation Firefox

### Mode Développement

1. Construire l'extension :

   ```bash
   npm run build:firefox
   ```

2. Charger dans Firefox :
   - Naviguer vers `about:debugging#/runtime/this-firefox`
   - Cliquer sur "Charger un module complémentaire temporaire..."
   - Sélectionner `dist/firefox/manifest.json`

### Mode Production

1. Créer un fichier `.xpi` :

   ```bash
   cd dist/firefox
   zip -r ../rgaa-auditor-firefox.xpi *
   ```

2. Installer :
   - Naviguer vers `about:addons`
   - Cliquer sur l'icône engrenage ⚙️
   - Sélectionner "Installer un module depuis un fichier..."
   - Choisir le fichier `.xpi`

## Différences Techniques

### Content Security Policy

Firefox et Chrome utilisent la même CSP :

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

### Permissions

Les mêmes permissions fonctionnent pour les deux navigateurs :

- `activeTab` - Accès à l'onglet actif
- `storage` - Stockage local
- `tabs` - API des onglets

### Web Accessible Resources

Configuration identique pour les deux navigateurs :

```json
{
  "web_accessible_resources": [
    {
      "resources": ["src/content/auditor/*.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## Testing Cross-Browser

### Tests Unitaires

Les tests unitaires utilisent jsdom et fonctionnent indépendamment du navigateur :

```bash
npm test
```

### Tests E2E

Les tests E2E Playwright supportent Firefox et Chrome :

```javascript
// playwright.config.js
projects: [
  { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  { name: "chromium", use: { ...devices["Desktop Chrome"] } }
]
```

Lancer les tests :

```bash
npm run test:e2e
```

## Fonctionnalités Communes

Toutes les fonctionnalités sont disponibles dans les deux navigateurs :

✅ 106 critères RGAA automatisés
✅ Interface Vue 3 avec Composition API
✅ Stockage différentiel avec JSON Patch
✅ Export HTML, JSON, CSV
✅ Historique des audits
✅ Comparaison d'audits
✅ Support bilingue (fr/en)
✅ Navigation clavier (WCAG 2.1 AA)
✅ Shadow DOM traversal
✅ Interface accessible

## Dépannage Firefox

### L'extension ne s'installe pas

**Problème** : Erreur lors du chargement du manifest

**Solution** :

- Vérifier que vous utilisez Firefox 115+
- Reconstruire avec `npm run build:firefox`
- Vérifier que le manifest.json est présent dans `dist/firefox/`

### Le service worker ne démarre pas

**Problème** : Background script ne s'initialise pas

**Solution** :

- Ouvrir la console du navigateur (Ctrl+Shift+J)
- Vérifier les erreurs dans l'onglet "Modules complémentaires"
- S'assurer que `webextension-polyfill` est importé

### Le content script n'est pas injecté

**Problème** : L'audit ne démarre pas sur la page

**Solution** :

- Rafraîchir la page après installation de l'extension
- Vérifier que l'URL n'est pas restreinte (`about:`, `chrome://`, `file://`)
- Consulter les logs avec "Inspecter" dans `about:debugging`

## Ressources

- [Documentation Firefox WebExtensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Documentation webextension-polyfill](https://github.com/mozilla/webextension-polyfill)
- [Guide Manifest V3](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/)

## Checklist de Compatibilité

Lors de l'ajout de nouvelles fonctionnalités, vérifier :

- [ ] Utilisation de `browser` au lieu de `chrome`
- [ ] Test dans Firefox ET Chrome
- [ ] Pas d'APIs spécifiques à un navigateur
- [ ] Build réussi pour les deux cibles
- [ ] Documentation mise à jour si nécessaire
