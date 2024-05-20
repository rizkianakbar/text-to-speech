import type { Metadata } from "next";
import { Readex_Pro } from "next/font/google";
import "./globals.css";

const readexPro = Readex_Pro({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Text to Speech | Rizkian Akbar",
  description: "Web app to convert text to speech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={readexPro.className}>
        {children}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </body>
    </html>
  );
}
