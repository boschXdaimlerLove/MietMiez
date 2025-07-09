import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/footer";
import HeaderWrapper from "@/app/components/HeaderWrapper";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
//
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "MietMietz",
  description: "Rent a pet!",
  applicationName: "MietMietz",
  creator: "MietMietz Team",
  publisher: "MietMietz Team",
  authors: [
    {
      name: "Julian Schumacher",
      url: "https://julianschumacher.dev",
    },
    {
      name: "Felix Hennerich",
    },
    {
      name: "Nils Schäffner",
    },
    {
      name: "Gregor Gottschewski",
    },
    {
      name: "Bruno Lange",
    },
  ],
  assets: "https://mietmietz.de/public",
  formatDetection: {
    telephone: true,
    email: true,
    url: true,
    date: true,
    address: true,
  },
  referrer: "origin",
  abstract:
    "Want to rent a pet? This project is a pet-renting platform made for an university assignment.",
  keywords: ["mietmiez, rent, pet, cat, dog"],
  generator: "Next.js",
  robots: {},
  icons: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>MietMiez</title>
        {/* favicon */}
        {/*<link rel="icon" href="/favicon.ico" sizes="any" />*/}
        <link rel="icon" href="/images/favicon.ico" sizes="any" />
        {/* icon */}
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        {/* apple icon */}
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased bg`}
        className="antialiased bg font-sans"
      >
        {/*<body className={`antialiased bg`}>*/}
        <div className="flex flex-col min-h-screen">
          <HeaderWrapper />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
