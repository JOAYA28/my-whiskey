import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "내 취향 한 잔, 위스키 편",
  description:
    "15개의 질문으로 피트, 셰리, 과일향, 바닐라, 스파이스까지 내 입맛에 맞는 위스키를 찾아보세요. 실제 향미 데이터 기반 매칭.",
  openGraph: {
    title: "내 취향 한 잔, 위스키 편",
    description:
      "15개의 질문으로 내 입맛에 맞는 위스키를 찾아주는 향미 데이터 기반 매칭 서비스.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f0a06",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKr.variable}>
      <body className="font-sans antialiased text-white">{children}</body>
    </html>
  );
}
