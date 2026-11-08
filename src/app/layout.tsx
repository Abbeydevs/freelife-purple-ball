import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freelife Purple Ball & After Party",
  description: "An evening of elegance, connection & celebration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} relative min-h-screen bg-black text-zinc-100 antialiased overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-0 bg-[url('/dinner-bg.jpeg')] bg-cover bg-center bg-no-repeat" />

        <div className="fixed inset-0 z-0 bg-black/85 backdrop-blur-xs" />

        <div className="fixed top-[-10%] left-[-10%] w-160 h-160 bg-purple-900/10 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-10%] w-160 h-160 bg-fuchsia-900/10 rounded-full blur-[150px] pointer-events-none z-0" />

        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>

        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
