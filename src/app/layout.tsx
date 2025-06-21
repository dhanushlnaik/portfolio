import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import { Space_Grotesk } from 'next/font/google';
import "./globals.css";
import Navbar from "~/components/layout/Navbar";
import StarsCanvas from "~/components/layout/StarsCanvas"
import Footer from "~/components/layout/Footer";

const inter = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dhanush Naik",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#030014] text-white overflow-y-scroll overflow-x-hidden`}>
        <Navbar/>
        <main className="mx-20">
               {children}
        </main>
   
         <Footer/>
        </body>
       
    </html>
  );
}
