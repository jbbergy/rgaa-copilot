# Guide de Validation Firefox

Ce guide vous aide à valider que l'extension RGAA Copilot fonctionne correctement dans Firefox.

## 🔧 Préparation

### 1. Construction de l'Extension

```bash
npm run build:firefox
```

Cette commande génère le build optimisé dans `dist/firefox/`.

### 2. Vérification du Build

Vérifiez que les fichiers suivants existent :

- ✅ `dist/firefox/manifest.json`
- ✅ `dist/firefox/popup.html`
- ✅ `dist/firefox/src/background/service-worker.js`
- ✅ `dist/firefox/src/content/content-script.js`
- ✅ `dist/firefox/icons/` (icon-16.png, icon-48.png, icon-128.png)
- ✅ `dist/firefox/_locales/` (en/messages.json, fr/messages.json)

## 🦊 Installation dans Firefox

### Méthode 1 : Test Manuel Automatique (Recommandé)

```bash
npm run test:manual:firefox
```

Ce script :

1. Vérifie que le build existe
2. Crée un profil Firefox temporaire
3. Lance Firefox avec `about:debugging` ouvert
4. Vous guide pour charger l'extension

### Méthode 2 : Chargement Manuel

1. Ouvrir Firefox
2. Naviguer vers `about:debugging#/runtime/this-firefox`
3. Cliquer sur **"Charger un module complémentaire temporaire..."**
4. Sélectionner `e:\a11y-addon\dist\firefox\manifest.json`
5. L'extension devrait apparaître dans la liste

### Méthode 3 : Installation XPI (Production)

```bash
cd dist/firefox
zip -r ../rgaa-auditor-firefox.xpi *
```

Puis dans Firefox :

1. Naviguer vers `about:addons`
2. Cliquer sur l'icône engrenage ⚙️
3. Sélectionner **"Installer un module depuis un fichier..."**
4. Choisir `rgaa-auditor-firefox.xpi`

## ✅ Tests de Validation

### Test 1 : Vérification du Chargement

**Objectif** : S'assurer que l'extension se charge sans erreur

1. Après installation, ouvrir la console du navigateur (Ctrl+Shift+J)
2. Vérifier dans l'onglet **"Console"** qu'il n'y a pas d'erreurs
3. Rechercher le message : `"RGAA Copilot service worker initialized"`
4. Naviguer vers `about:debugging#/runtime/this-firefox`
5. Cliquer sur **"Inspecter"** sous l'extension
6. Vérifier qu'aucune erreur n'apparaît

**Résultat attendu** : ✅ Aucune erreur, message d'initialisation visible

### Test 2 : Interface Popup

**Objectif** : Vérifier que le popup s'affiche correctement

1. Naviguer vers une page web (ex: `https://example.com`)
2. Cliquer sur l'icône de l'extension dans la barre d'outils
3. Le popup devrait s'afficher avec :
   - ✅ Titre "RGAA Copilot"
   - ✅ Bouton "Start Audit" / "Démarrer l'audit"
   - ✅ Sélecteur de langue (fr/en)
   - ✅ URL de la page actuelle affichée

**Résultat attendu** : ✅ Interface complète et réactive

### Test 3 : Audit Basique

**Objectif** : Exécuter un audit complet sur une page de test

1. Ouvrir la page de test : `file:///e:/a11y-addon/tests/fixtures/violations-page.html`
2. Cliquer sur l'icône de l'extension
3. Cliquer sur **"Start Audit"**
4. Observer la barre de progression
5. Attendre la fin de l'audit (10-30 secondes)

**Résultats attendus** :

- ✅ Barre de progression affichée
- ✅ Message de progression mis à jour
- ✅ Résultats affichés avec :
  - Score global
  - Liste des critères (106 au total)
  - Statuts : ✅ Pass, ❌ Fail, ⚠️ Manual
  - Nombre de violations

### Test 4 : Détails des Violations

**Objectif** : Vérifier l'affichage des détails de violations

1. Après un audit avec violations
2. Cliquer sur un critère avec statut ❌ Fail
3. Vérifier l'affichage :
   - ✅ Description du critère en français/anglais
   - ✅ Niveau WCAG (A, AA, AAA)
   - ✅ Liste des violations avec :
     - Code HTML
     - Message d'erreur
     - Recommandation de correction
   - ✅ Bouton "Highlight" pour surligner l'élément

**Résultat attendu** : ✅ Toutes les informations sont visibles et lisibles

### Test 5 : Surlignage d'Éléments

**Objectif** : Vérifier que le surlignage fonctionne

1. Dans les détails d'une violation
2. Cliquer sur le bouton **"Highlight"**
3. L'élément devrait être surligné sur la page avec :
   - ✅ Bordure rouge épaisse
   - ✅ Fond jaune semi-transparent
   - ✅ Scroll automatique vers l'élément

**Résultat attendu** : ✅ Élément visible et surligné correctement

### Test 6 : Export de Rapport

**Objectif** : Vérifier l'export dans différents formats

1. Après un audit complet
2. Cliquer sur le bouton **"Export"**
3. Tester chaque format :
   - **HTML** : Cliquer "Download HTML"
   - **JSON** : Cliquer "Download JSON"
   - **CSV** : Cliquer "Download CSV"

**Résultats attendus** :

- ✅ Fichier téléchargé pour chaque format
- ✅ HTML : Rapport lisible dans le navigateur
- ✅ JSON : Structure valide (vérifier avec un validateur)
- ✅ CSV : Ouvrable dans Excel/LibreOffice

### Test 7 : Historique

**Objectif** : Vérifier le stockage et l'affichage de l'historique

1. Effectuer 2-3 audits sur la même page
2. Cliquer sur le bouton **"History"** / **"Historique"**
3. Vérifier :
   - ✅ Liste des audits précédents
   - ✅ Date et heure de chaque audit
   - ✅ Score de chaque audit
   - ✅ Possibilité de visualiser un ancien audit

**Résultat attendu** : ✅ Historique complet et accessible

### Test 8 : Comparaison d'Audits

**Objectif** : Vérifier la fonctionnalité de comparaison

1. Dans l'historique, sélectionner deux audits
2. Cliquer sur **"Compare"**
3. Vérifier l'affichage :
   - ✅ Différences de score
   - ✅ Critères améliorés (vert)
   - ✅ Critères dégradés (rouge)
   - ✅ Critères inchangés (gris)

**Résultat attendu** : ✅ Comparaison claire et précise

### Test 9 : Navigation Clavier

**Objectif** : Vérifier l'accessibilité au clavier (WCAG 2.1 AA)

1. Ouvrir le popup
2. Utiliser uniquement le clavier :
   - **Tab** : Naviguer entre les éléments
   - **Enter** : Activer les boutons
   - **Espace** : Cocher/décocher
   - **Flèches ↑/↓** : Naviguer dans les listes
   - **Escape** : Fermer les dialogues

**Résultats attendus** :

- ✅ Focus visible sur tous les éléments
- ✅ Ordre de tabulation logique
- ✅ Tous les boutons activables au clavier
- ✅ Pas de piège au clavier

### Test 10 : Changement de Langue

**Objectif** : Vérifier le support bilingue

1. Ouvrir le popup
2. Cliquer sur le sélecteur de langue
3. Changer entre FR et EN
4. Vérifier que :
   - ✅ L'interface change de langue
   - ✅ Les messages changent de langue
   - ✅ Les descriptions de critères changent
   - ✅ Le choix est persisté

**Résultat attendu** : ✅ Basculement fluide entre les langues

## 🐛 Tests de Cas Limites

### Test 11 : Pages Restreintes

**Objectif** : Vérifier le comportement sur les pages non-auditables

Tester sur :

- `about:addons`
- `about:config`
- `about:debugging`

**Résultat attendu** : ✅ Message d'erreur clair expliquant que la page ne peut pas être auditée

### Test 12 : Pages avec Shadow DOM

**Objectif** : Vérifier la traversée du Shadow DOM

1. Créer une page de test avec Web Components
2. Lancer un audit
3. Vérifier que les éléments dans le Shadow DOM sont analysés

**Résultat attendu** : ✅ Violations détectées dans le Shadow DOM

### Test 13 : Pages avec Iframes

**Objectif** : Vérifier la détection des iframes

1. Naviguer vers une page avec iframes
2. Lancer un audit
3. Vérifier le critère 2.1 (Iframes avec titre)

**Résultat attendu** : ✅ Iframes détectées et analysées

### Test 14 : Pages Longues

**Objectif** : Tester la performance sur des pages complexes

1. Naviguer vers une page avec 1000+ éléments DOM
2. Lancer un audit
3. Mesurer le temps d'exécution

**Résultat attendu** : ✅ Audit complété en moins de 60 secondes

## 📊 Tests de Performance

### Test 15 : Mémoire

**Objectif** : Vérifier l'utilisation de la mémoire

1. Ouvrir `about:memory`
2. Cliquer sur **"Measure"**
3. Noter la mémoire utilisée
4. Lancer plusieurs audits
5. Re-mesurer la mémoire

**Résultat attendu** : ✅ Pas de fuite mémoire majeure (< 100 MB)

### Test 16 : Stockage

**Objectif** : Vérifier la gestion du quota de stockage

1. Effectuer 20+ audits sur différentes pages
2. Vérifier dans `about:debugging` → Storage
3. Observer l'utilisation du stockage

**Résultat attendu** : ✅ Stockage géré efficacement avec cleanup automatique

## 🔍 Console Debugging

### Commandes Utiles

**Voir les messages de l'extension** :

1. `Ctrl+Shift+J` → Console du navigateur
2. Filtrer par "RGAA"

**Inspecter le popup** :

1. Clic droit sur l'icône de l'extension
2. "Inspecter la popup"

**Voir le stockage** :

1. `about:debugging#/runtime/this-firefox`
2. Extension → "Inspecter"
3. Onglet "Storage"

## ✅ Checklist Finale

Avant de valider la compatibilité Firefox, vérifier :

- [ ] Build Firefox se construit sans erreur
- [ ] Extension se charge dans Firefox
- [ ] Popup s'affiche correctement
- [ ] Audit basique fonctionne
- [ ] Détails des violations visibles
- [ ] Surlignage fonctionne
- [ ] Export HTML/JSON/CSV réussi
- [ ] Historique enregistré
- [ ] Comparaison d'audits fonctionne
- [ ] Navigation clavier complète
- [ ] Changement de langue opérationnel
- [ ] Pages restreintes gérées
- [ ] Shadow DOM traversé
- [ ] Iframes détectées
- [ ] Performance acceptable
- [ ] Pas de fuite mémoire
- [ ] Stockage géré correctement

## 🚀 Validation Automatisée

Lancer les tests E2E sur Firefox :

```bash
npm run test:e2e:firefox
```

**Résultat attendu** : ✅ Tous les tests passent

## 📝 Rapport de Bug

Si vous trouvez un problème, créer un rapport avec :

1. **Version Firefox** : `about:support`
2. **Version Extension** : 0.1.0
3. **URL de la page testée**
4. **Étapes de reproduction**
5. **Résultat attendu vs obtenu**
6. **Logs de la console** (Ctrl+Shift+J)
7. **Logs de l'extension** (about:debugging → Inspecter)

## 📚 Ressources

- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Debugging Extensions](https://extensionworkshop.com/documentation/develop/debugging/)
