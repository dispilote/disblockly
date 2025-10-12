import BlocklyBootstrap from "./_components/BlocklyBootstrap";

export default function Home() {
  return (
    <main>
      <h1 style={{ padding: "20px", margin: 0 }}>Disblockly - Discord Bot Logic with Blocks</h1>
      <BlocklyBootstrap fullScreen={false} width="100%" height="calc(100vh - 80px)" />
    </main>
  );
}
