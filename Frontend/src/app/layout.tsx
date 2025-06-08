import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; 

export const metadata: Metadata = {
  title: "Voltic",
  description: "Inteligência Energética para Cidades do Futuro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
