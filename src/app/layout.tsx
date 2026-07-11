import type { Metadata } from "next";
import { Noto_Sans_HK, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansHK = Noto_Sans_HK({
  variable: "--font-noto-sans-hk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MC Adrian Chan | 香港婚禮司儀",
  description:
    "MC Adrian Chan — 香港婚禮及宴會司儀。內斂但專業，低調但穩陣：你享受每一刻，我負責每一步。提供婚禮流程（Rundown）製作工具同籌備資訊。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-HK"
      className={`${notoSansHK.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
