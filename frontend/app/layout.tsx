import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"]});

export const metadata: Metadata = {
  title: "YouTube Quiz Generator",
  description: "AI-powered YouTube quiz generator designed to enhance your study with interactive and engaging quizzes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
