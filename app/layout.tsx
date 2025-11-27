import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "PEAI - Plataforma de Encuestas Interactivas",
    template: "%s | PEAI",
  },
  description:
    "Plataforma moderna para crear, gestionar y responder encuestas educativas con una experiencia visual atractiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
