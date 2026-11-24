import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { ServiceWorkerRegistration } from "@/features/pwa/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Profaile — Resume to Portfolio in Seconds",
  description:
    "Upload your resume, pick a stunning theme, and get a live portfolio site instantly. Powered by AI.",
  keywords: ["portfolio", "resume", "AI", "developer portfolio", "profaile"],
  appleWebApp: { capable: true, title: "Profaile", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ServiceWorkerRegistration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
