import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Farming Management System",
  description: "Redis-powered farm management platform with Supabase authentication"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
