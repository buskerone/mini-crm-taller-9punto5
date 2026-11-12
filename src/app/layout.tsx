import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "mini-CRM · taller «Cursor a fondo»",
  description: "Mini-CRM de práctica: clientes, cotizaciones y cobros de una pyme ficticia.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-CL" className={cn(GeistSans.variable, GeistMono.variable, "antialiased")}>
      <body className="min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
