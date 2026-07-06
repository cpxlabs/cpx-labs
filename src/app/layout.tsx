import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "CPX Labs — Consultoria em TI",
  description:
    "O CPX Labs é um grupo de consultoria em TI especializado em transformação digital, desenvolvimento de software, cloud, segurança e inteligência artificial.",
  keywords: [
    "consultoria TI",
    "transformação digital",
    "desenvolvimento de software",
    "cloud",
    "segurança da informação",
    "inteligência artificial",
    "CPX Labs",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        <PageTransition>
          <main className="flex-1">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
