import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";

const jua = Jua({ 
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "현아의 수학교실",
  description: "즐겁고 재미있는 현아의 수학교실",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={jua.className}>{children}</body>
    </html>
  );
}
