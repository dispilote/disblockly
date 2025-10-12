# Disblockly

Make discord bot logic with blocks using Blockly and Next.js.

![Blockly Interface](https://github.com/user-attachments/assets/0b6bdc17-c8cd-474e-865b-8370b53ef7b9)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the Blockly interface.

## ✨ Features

- ✅ **Blockly Integration** - Visual programming interface for Discord bot logic
- ✅ **Next.js 14** - Modern React framework with App Router
- ✅ **TypeScript** - Type-safe development
- ✅ **Client-side Rendering** - Dynamic Blockly loading to avoid SSR issues
- ✅ **Fullscreen Mode** - Option to use Blockly in fullscreen
- ✅ **Standard Blocks** - All Blockly standard blocks (logic, loops, math, text, lists, variables, functions)

## 📖 Documentation

See [BLOCKLY_GUIDE.md](./BLOCKLY_GUIDE.md) for detailed documentation on:
- Component usage and props
- Resolving "Invalid block definition" errors
- Customizing the toolbox
- Available blocks
- Code generation

## 🎯 Usage

### Basic Usage

```tsx
import BlocklyBootstrap from "@/app/_components/BlocklyBootstrap";

export default function MyPage() {
  return <BlocklyBootstrap width="100%" height="600px" />;
}
```

### Fullscreen Mode

```tsx
import BlocklyBootstrap from "@/app/_components/BlocklyBootstrap";

export default function FullscreenPage() {
  return <BlocklyBootstrap fullScreen={true} />;
}
```

See `/fullscreen-example` for a live demo.

## 🔧 Technical Details

### Block Definitions Fix

The common "Invalid block definition for type: controls_if" error is resolved by importing block definitions before workspace initialization:

```typescript
await import("blockly/blocks");  // Critical import!
await import("blockly/javascript");  // For code generation
```

This is already handled in the `BlocklyBootstrap` component.

## 📝 License

Apache License 2.0 - see [LICENSE](./LICENSE) file for details
