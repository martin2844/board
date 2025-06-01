import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Mateboard - Modern Anonymous Textboard",
  description: "A modern, anonymous textboard platform where you can create threads, reply anonymously, and engage in discussions. Built with Next.js featuring real-time search and clean interface.",
  keywords: ["textboard", "imageboard", "anonymous", "forum", "discussion", "threads", "replies", "modern board", "anonymous posting"],
  authors: [{ name: "CodigoMate team" }],
  creator: "CodigoMate",
  publisher: "CodigoMate",
  metadataBase: new URL("https://board.codigomate.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://board.codigomate.com",
    title: "Mateboard - Modern Anonymous Textboard",
    description: "A modern, anonymous textboard platform where you can create threads, reply anonymously, and engage in discussions. Built with Next.js featuring real-time search and clean interface.",
    siteName: "Mateboard",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Mateboard - Modern Anonymous Textboard",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mateboard - Modern Anonymous Textboard",
    description: "A modern, anonymous textboard platform where you can create threads, reply anonymously, and engage in discussions. Built with Next.js featuring real-time search and clean interface.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ minHeight: "100vh" }}
        className="bg-[#f0f8f0] font-mono min-h-screen"
      >
        <Header />
        <div className="max-w-6xl my-4 md:my-8 mx-auto min-h-[calc(100vh-212px)] md:px-0 px-4">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
