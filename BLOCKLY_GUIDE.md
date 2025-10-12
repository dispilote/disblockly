# Blockly Integration Guide

## Vue d'ensemble

Ce projet intègre [Blockly](https://developers.google.com/blockly) dans une application Next.js pour créer une interface visuelle de programmation par blocs pour les bots Discord.

## Configuration et Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Utilisation du composant BlocklyBootstrap

### Exemple de base

```tsx
import BlocklyBootstrap from "@/app/_components/BlocklyBootstrap";

export default function MyPage() {
  return (
    <BlocklyBootstrap 
      width="100%" 
      height="600px" 
    />
  );
}
```

### Mode plein écran

```tsx
import BlocklyBootstrap from "@/app/_components/BlocklyBootstrap";

export default function FullscreenPage() {
  return <BlocklyBootstrap fullScreen={true} />;
}
```

Voir l'exemple en action : `/fullscreen-example`

### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `width` | `string` | `"100%"` | Largeur du composant (ex: "800px", "100%") |
| `height` | `string` | `"600px"` | Hauteur du composant (ex: "600px", "100vh") |
| `fullScreen` | `boolean` | `false` | Active le mode plein écran (position fixe) |

## Résolution du problème "Invalid block definition"

### Problème

L'erreur suivante peut apparaître lors de l'utilisation de blocs Blockly :

```
Invalid block definition for type: controls_if
```

### Cause

Cette erreur se produit lorsque les définitions de blocs standard de Blockly ne sont pas importées avant leur utilisation dans le toolbox.

### Solution

Le composant `BlocklyBootstrap` importe automatiquement les définitions de blocs standard :

```typescript
// Import des définitions de blocs - CRUCIAL!
await import("blockly/blocks");

// Import du générateur de code JavaScript (optionnel)
await import("blockly/javascript");
```

Ces imports doivent être effectués **avant** `Blockly.inject()`.

## Architecture technique

### Chargement dynamique côté client

Le composant utilise un import dynamique pour éviter les erreurs de rendu côté serveur (SSR) :

```typescript
"use client";  // Directive Next.js pour le rendu client uniquement

useEffect(() => {
  const initBlockly = async () => {
    // Import dynamique de Blockly
    const Blockly = await import("blockly");
    await import("blockly/blocks");
    
    // Initialisation du workspace
    workspace = Blockly.inject(/* ... */);
  };
  
  initBlockly();
}, []);
```

### Nettoyage du workspace

Le composant gère automatiquement la destruction du workspace lors du démontage :

```typescript
return () => {
  if (workspaceRef.current?.dispose) {
    workspaceRef.current.dispose();
  }
};
```

## Configuration du Toolbox

### Configuration actuelle

Le composant utilise actuellement un `flyoutToolbox` avec deux blocs de contrôle :

- `controls_if` : Bloc conditionnel if/else
- `controls_whileUntil` : Bloc de boucle while/until

### Personnalisation

Pour ajouter d'autres blocs, modifiez la configuration du toolbox dans `BlocklyBootstrap.tsx` :

```typescript
workspace = Blockly.inject(blocklyDivRef.current, {
  toolbox: {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "controls_if" },
      { kind: "block", type: "controls_whileUntil" },
      { kind: "block", type: "logic_compare" },
      { kind: "block", type: "math_number" },
      // Ajoutez d'autres blocs ici
    ],
  },
});
```

## Blocs disponibles

Avec l'import de `blockly/blocks`, les blocs suivants sont disponibles :

### Logique
- `controls_if` - If/Else
- `logic_compare` - Comparaison
- `logic_operation` - AND/OR
- `logic_negate` - NOT
- `logic_boolean` - True/False
- `logic_null` - Null
- `logic_ternary` - Opérateur ternaire

### Boucles
- `controls_repeat_ext` - Répéter n fois
- `controls_whileUntil` - While/Until
- `controls_for` - For
- `controls_forEach` - For each
- `controls_flow_statements` - Break/Continue

### Mathématiques
- `math_number` - Nombre
- `math_arithmetic` - Opérations (+, -, *, /)
- `math_single` - Fonctions (racine, abs, etc.)
- `math_trig` - Trigonométrie
- `math_constant` - Constantes (π, e, etc.)
- `math_number_property` - Propriétés de nombres
- `math_round` - Arrondi
- `math_on_list` - Opérations sur listes

### Texte
- `text` - Texte
- `text_join` - Concaténation
- `text_append` - Ajout de texte
- `text_length` - Longueur
- `text_isEmpty` - Est vide
- `text_indexOf` - Index de
- `text_charAt` - Caractère à
- `text_changeCase` - Changer casse
- `text_trim` - Supprimer espaces

### Listes
- `lists_create_with` - Créer une liste
- `lists_repeat` - Répéter élément
- `lists_length` - Longueur
- `lists_isEmpty` - Est vide
- `lists_indexOf` - Index de
- `lists_getIndex` - Obtenir/Supprimer élément
- `lists_setIndex` - Définir/Insérer élément

### Variables
- `variables_get` - Obtenir variable
- `variables_set` - Définir variable

### Fonctions
- `procedures_defnoreturn` - Définir fonction
- `procedures_defreturn` - Définir fonction avec retour
- `procedures_callnoreturn` - Appeler fonction
- `procedures_callreturn` - Appeler fonction avec retour

## Génération de code

Pour générer du code JavaScript à partir des blocs :

```typescript
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";

// Dans votre composant
const generateCode = () => {
  const code = javascriptGenerator.workspaceToCode(workspace);
  console.log(code);
};
```

## Pages d'exemple

- `/` - Page principale avec Blockly intégré
- `/fullscreen-example` - Exemple en mode plein écran

## Dépannage

### Les blocs n'apparaissent pas

1. Vérifiez que `blockly/blocks` est bien importé
2. Vérifiez la console du navigateur pour des erreurs
3. Assurez-vous que le composant a la directive `"use client"`

### Erreur SSR (Server-Side Rendering)

Si vous obtenez des erreurs liées à `window` ou `document` non définis :

1. Assurez-ez que le composant utilise `"use client"`
2. Vérifiez que Blockly est importé dynamiquement dans `useEffect`

### Le workspace ne se charge pas

1. Attendez que le composant soit monté (useEffect)
2. Vérifiez que `blocklyDivRef.current` n'est pas null
3. Consultez les logs de la console

## Resources

- [Documentation Blockly](https://developers.google.com/blockly)
- [Blockly sur GitHub](https://github.com/google/blockly)
- [API Reference](https://developers.google.com/blockly/reference/js)
