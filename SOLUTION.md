# Solution Summary: Fixing "Invalid block definition for type: controls_if"

## ❌ Le Problème

Lors de l'utilisation de Blockly avec le code suivant :

```typescript
const workspace = Blockly.inject(blocklyDivRef.current, {
  toolbox: {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'controls_if' },
      { kind: 'block', type: 'controls_whileUntil' }
    ]
  }
});
```

L'erreur suivante apparaissait :
```
Invalid block definition for type: controls_if
```

## ✅ La Solution

### Cause racine
Les définitions de blocs standard de Blockly n'étaient pas chargées avant l'initialisation du workspace.

### Correction requise
Ajouter les imports suivants **AVANT** `Blockly.inject()` :

```typescript
import * as Blockly from "blockly";
import "blockly/blocks";           // ← CRUCIAL : Définitions des blocs
import "blockly/javascript";       // ← OPTIONNEL : Générateur de code
```

### Dans un composant Next.js (avec SSR)

Pour éviter les erreurs de rendu côté serveur, utiliser des imports dynamiques dans `useEffect` :

```typescript
"use client";

import { useEffect, useRef } from "react";

export default function BlocklyComponent() {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initBlockly = async () => {
      if (!blocklyDivRef.current) return;

      // Import dynamique de Blockly
      const Blockly = await import("blockly");
      
      // Import des définitions de blocs - CRITIQUE!
      await import("blockly/blocks");
      await import("blockly/javascript");

      // Maintenant on peut injecter le workspace
      const workspace = Blockly.inject(blocklyDivRef.current, {
        toolbox: {
          kind: "flyoutToolbox",
          contents: [
            { kind: "block", type: "controls_if" },
            { kind: "block", type: "controls_whileUntil" }
          ]
        }
      });

      // Cleanup
      return () => {
        workspace?.dispose();
      };
    };

    initBlockly();
  }, []);

  return <div ref={blocklyDivRef} style={{ width: "100%", height: "600px" }} />;
}
```

## 📋 Points clés à retenir

1. **Toujours importer `blockly/blocks`** avant d'utiliser des blocs dans le toolbox
2. **Pour Next.js** : Utiliser `"use client"` et des imports dynamiques dans `useEffect`
3. **Cleanup** : Appeler `workspace.dispose()` lors du démontage du composant
4. **Ordre d'import** :
   ```typescript
   import("blockly")           // 1. Core library
   import("blockly/blocks")    // 2. Block definitions
   import("blockly/javascript") // 3. Code generators (optionnel)
   ```

## 🎯 Résultat

✅ Tous les blocs standard sont disponibles :
- Logic (if, compare, boolean, etc.)
- Loops (while, for, forEach, etc.)
- Math (arithmetic, functions, etc.)
- Text (concat, length, etc.)
- Lists (create, get, set, etc.)
- Variables
- Functions

✅ Aucune erreur "Invalid block definition"

✅ Compatible avec Next.js et le rendu côté serveur

## 📚 Ressources

- [Code complet dans BlocklyBootstrap.tsx](./app/_components/BlocklyBootstrap.tsx)
- [Guide complet](./BLOCKLY_GUIDE.md)
- [Documentation Blockly officielle](https://developers.google.com/blockly)
