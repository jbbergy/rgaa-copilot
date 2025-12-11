# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### À venir
- Support des pages dynamiques (SPA avec routing)
- Export en format PDF
- Mode "audit léger" pour tests rapides

## [1.0.0] - 2025-12-11

### ✨ Features
- Audit automatisé de 106 critères RGAA 4.1.2
- Interface popup Vue 3 bilingue (français/anglais)
- Moteur de stockage différentiel avec JSON Patch
- Support complet Firefox 115+ et Chrome 120+
- Détection et audit des Shadow DOM et iframes
- Historique des audits avec comparaison
- Export des résultats (JSON, CSV)
- Système de cache optimisé pour les performances

### 📊 Critères Implémentés
- Topic 1: Alternatives textuelles (9 critères)
- Topic 2: Cadres (2 critères)
- Topic 3: Couleurs (3 critères)
- Topic 4: Multimédia (13 critères)
- Topic 5: Tableaux (8 critères)
- Topic 6: Liens (1 critère)
- Topic 7: Scripts (5 critères)
- Topic 8: Éléments obligatoires (10 critères)
- Topic 9: Structuration de l'information (4 critères)
- Topic 10: Présentation de l'information (14 critères)
- Topic 11: Formulaires (13 critères)
- Topic 12: Navigation (3 critères)
- Topic 13: Consultation (4 critères)

### 🎯 Compatibilité
- Firefox 115+ (Manifest V3)
- Chrome 120+ (Manifest V3)
- Edge (via build Chrome)

### 📦 Architecture
- Content script avec audit engine modulaire
- Background service worker minimal
- Communication cross-browser avec webextension-polyfill
- Build Vite optimisé par navigateur

### ⚡ Performance
- Limite de 100 violations par critère
- RequestIdleCallback pour tâches non critiques
- Memoization des styles calculés
- Lazy loading des composants Vue

### ♿ Accessibilité
- Focus trap dans les dialogues
- Roving tabindex pour navigation clavier
- Annonces ARIA pour lecteurs d'écran
- Restauration du focus après fermeture modale

### 🧪 Tests
- 25+ tests unitaires (Vitest + jsdom)
- 4 scénarios E2E (Playwright)
- Fixtures pour tests d'accessibilité
- Coverage > 80%

[Unreleased]: https://github.com/VOTRE-USERNAME/a11y-addon/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/VOTRE-USERNAME/a11y-addon/releases/tag/v1.0.0
