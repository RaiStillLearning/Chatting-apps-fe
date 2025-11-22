// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes"; // ← langsung dari next-themes, bukan file lain

export const metadata: Metadata = {
  title: "Rumpi",
  description: "Chatting apps Rumpi (ngobrol santai)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
