import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "HeartBridge — Cardiac Rehab Companion",
  description: "Guided cardiac rehabilitation with AI companion, real-time monitoring, and emergency response.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HeartBridge",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /** Allow pinch-zoom — important for low vision and many older adults */
  maximumScale: 5,
  userScalable: true,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="app-container">
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
