import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disblockly - Discord Bot Logic with Blocks",
  description: "Make discord bot logic with blocks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
