import type { Metadata } from "next";
import "./globals.scss";
import localFont from "next/font/local";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "InverseHelper.Modal",
  description: "Модальное окон для Inverse.Helper",
};

const RF_Dewi = localFont({
  src: [
    {
      path: "../../public/font/RFDewi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/RFDewi-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/RFDewi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={RF_Dewi.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
