import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Management App",
  description: "Manage users effectively with CRUD operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-svh`}
      >
        <main className="flex-1">{children}</main>
        <footer>
          <div className="container mx-auto mb-4 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Developed by{" "}
              <Link
                href="https://irfan-za.com"
                target="_blank"
                className="underline"
              >
                irfan
              </Link>
              . All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
