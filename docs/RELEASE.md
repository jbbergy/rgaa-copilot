# Guide de Release

## Prérequis

- Compte GitHub avec accès au repository
- Git configuré localement
- Node.js 18+ installé
- Tests passants (`npm test` et `npm run test:e2e`)

## Processus de Release

### 1. Préparer la version

```bash
# Mettre à jour la version dans package.json
npm version patch  # 1.0.0 → 1.0.1
# ou
npm version minor  # 1.0.0 → 1.1.0
# ou
npm version major  # 1.0.0 → 2.0.0
```

### 2. Créer les artefacts de release

```bash
# Build et package automatique pour Firefox et Chrome
npm run package
```

Cela génère:
- `rgaa-copilot-firefox.zip` - Extension pour Firefox (AMO et installation manuelle)
- `rgaa-copilot-chrome.zip` - Extension pour Chrome Web Store

### 3. Mettre à jour le CHANGELOG

Créer ou mettre à jour `CHANGELOG.md` avec:
- Nouvelles fonctionnalités (✨ Features)
- Corrections de bugs (🐛 Bug Fixes)
- Améliorations de performance (⚡ Performance)
- Changements breaking (💥 Breaking Changes)
- Critères RGAA ajoutés/modifiés

Exemple:
```markdown
## [1.1.0] - 2025-12-11

### ✨ Features
- Ajout de 15 nouveaux critères RGAA automatisés (8.1-8.15)
- Support du mode comparaison entre audits

### 🐛 Bug Fixes
- Correction de la détection Shadow DOM pour les Web Components
- Fix du focus trap dans les dialogues modaux

### ⚡ Performance
- Réduction de 40% du temps d'audit sur les pages complexes
- Optimisation du calcul de contraste des couleurs
```

### 4. Commit et tag

```bash
# Commit les changements
git add package.json CHANGELOG.md
git commit -m "chore: release v1.1.0"

# Créer le tag
git tag -a v1.1.0 -m "Release v1.1.0"

# Push vers GitHub
git push origin main
git push origin v1.1.0
```

### 5. Créer la release GitHub

#### Option A: Interface GitHub (recommandé)

1. Aller sur `https://github.com/VOTRE-USERNAME/a11y-addon/releases`
2. Cliquer sur "Draft a new release"
3. Sélectionner le tag `v1.1.0`
4. Titre: `RGAA Copilot v1.1.0`
5. Description: Copier le contenu du CHANGELOG pour cette version
6. Attacher les fichiers:
   - `rgaa-copilot-firefox.zip`
   - `rgaa-copilot-chrome.zip`
7. Cocher "Set as the latest release"
8. Cliquer "Publish release"

#### Option B: GitHub CLI

```bash
# Installer GitHub CLI: https://cli.github.com/
gh release create v1.1.0 \
  rgaa-copilot-firefox.zip \
  rgaa-copilot-chrome.zip \
  --title "RGAA Copilot v1.1.0" \
  --notes-file CHANGELOG.md
```

### 6. Publier sur les stores (optionnel)

#### Firefox Add-ons (AMO)

1. Aller sur https://addons.mozilla.org/developers/
2. "Submit New Add-on" ou "New Version" pour une mise à jour
3. Upload `rgaa-copilot-firefox.zip`
4. Remplir les métadonnées si première soumission
5. Attendre la validation (généralement 2-7 jours)

#### Chrome Web Store

1. Aller sur https://chrome.google.com/webstore/devconsole/
2. Sélectionner l'extension ou "New Item"
3. Upload `rgaa-copilot-chrome.zip`
4. Remplir les métadonnées si première soumission
5. Soumettre pour validation (généralement 1-3 jours)

## Checklist Avant Release

- [ ] Tous les tests passent (`npm test && npm run test:e2e`)
- [ ] Build réussi pour Firefox et Chrome (`npm run build`)
- [ ] Extension testée manuellement sur les deux navigateurs
- [ ] Version mise à jour dans `package.json`
- [ ] CHANGELOG.md à jour avec toutes les modifications
- [ ] Documentation README.md à jour si nécessaire
- [ ] Aucune donnée sensible ou API key dans le code
- [ ] Les deux fichiers `.zip` sont générés et fonctionnels

## Structure des Tags

- `v1.0.0` - Release majeure (breaking changes)
- `v1.1.0` - Release mineure (nouvelles fonctionnalités)
- `v1.0.1` - Patch (corrections de bugs)

## Notes

- **Firefox**: Les releases automatiques via AMO peuvent prendre plusieurs jours pour validation
- **Chrome**: La première soumission nécessite des frais de développeur ($5 unique)
- **Versioning**: Suivre [Semantic Versioning 2.0.0](https://semver.org/)
- **Assets**: Les fichiers ZIP doivent être < 10MB pour les stores
