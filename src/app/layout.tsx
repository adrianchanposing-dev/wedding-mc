import type { Metadata } from "next";
import { Noto_Sans_HK, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";

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
  metadataBase: new URL(site.url),
  title: {
    default: "MC Adrian Chan | 香港婚禮司儀 · 婚禮流程表製作",
    template: `%s | ${site.brand}`,
  },
  description:
    "MC Adrian Chan — 香港婚禮及宴會司儀。內斂而專業，低調而穩重：您安心享受每一刻，我用心成就每一步。提供免費婚禮流程表製作工具及婚禮籌備資訊。",
  keywords: [
    "香港婚禮司儀",
    "婚禮流程表",
    "婚禮時間表",
    "婚禮 rundown",
    "婚禮流程表製作",
    "證婚儀式流程",
    "婚宴司儀",
  ],
  openGraph: {
    type: "website",
    locale: "zh_HK",
    url: site.url,
    siteName: site.brand,
    title: "MC Adrian Chan | 香港婚禮司儀 · 婚禮流程表製作",
    description:
      "內斂而專業，低調而穩重：您安心享受每一刻，我用心成就每一步。提供免費婚禮流程表製作工具及婚禮籌備資訊。",
  },
  twitter: {
    card: "summary_large_image",
    title: "MC Adrian Chan | 香港婚禮司儀 · 婚禮流程表製作",
    description:
      "內斂而專業，低調而穩重：您安心享受每一刻，我用心成就每一步。提供免費婚禮流程表製作工具及婚禮籌備資訊。",
  },
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
