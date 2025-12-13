import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'fomantic-ui-css/semantic.min.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Α' Συντακτική Βουλή των Πολιτών",
  description: "Πλατφόρμα συμμετοχικής δημοκρατίας",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ margin: 0, padding: 0, backgroundColor: '#fff' }}
      >
        <div className="pusher">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>

        {/* Load jQuery and Fomantic UI JavaScript */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}