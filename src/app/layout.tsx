import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Profaile — Resume to Portfolio in Seconds",
  description:
    "Upload your resume, pick a stunning theme, and get a live portfolio site instantly. Powered by AI.",
  keywords: ["portfolio", "resume", "AI", "developer portfolio", "profaile"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
