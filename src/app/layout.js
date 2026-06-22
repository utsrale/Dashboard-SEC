import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "BEKAL - Board game, Edukasi, dan Klustering sisa pAngan Lokal",
  description: "Web Interaktif Klustering Pangan dan Game Edukasi Ular Tangga",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-[#F8F9FA] text-[#1E293B] font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
