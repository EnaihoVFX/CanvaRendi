import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wix Editor Clone",
  description: "A pixel-perfect recreation of the Wix website editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
