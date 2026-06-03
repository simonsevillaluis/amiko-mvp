import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMIKO MVP",
  description: "Asistente pedagógico inclusivo con IA para adaptar tareas escolares.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
