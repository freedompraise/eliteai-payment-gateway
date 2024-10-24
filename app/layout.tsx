import type { Metadata } from "next";
import { K2D } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense } from "react";
import Contact from "./Contact";

const k2d = K2D({
  subsets: ["latin"],
  weight: ["100", "200", "300", "600", "700"],
});

export const metadata: Metadata = {
  title: "ELITE GLOBAL AI FREE TRAINING + INTERNSHIP PROGRAM",
  description:
    "Elite Global AI invites you to explore the transformative world of artificial intelligence in diverse field such as Digital marketing, Content creation, Business Analytics, Data Analytics and Education.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${k2d.className} relative`}>
        <Suspense>
          {children}
          <ToastContainer position="top-center" theme="dark" hideProgressBar />
        </Suspense>
        <Contact />
      </body>
    </html>
  );
}
