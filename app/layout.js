import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Distill — AI Content Summarizer",
  description: "Turn any article, YouTube video, or PDF into a 1-minute summary, key takeaways, and action items in seconds. Try Distill free.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Distill — AI Content Summarizer",
    description: "Turn any article, YouTube video, or PDF into a 1-minute summary, key takeaways, and action items in seconds.",
    url: "https://getdistillapp.com",
    siteName: "Distill",
  },
}


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}