import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/footer";
import HeaderWrapper from "@/app/components/HeaderWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
            name: "Nils Schäffner"
        },
        {
            name: "Gregor Gottschewski",
        },
        {
            name: "Bruno Lange"
        }
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
    abstract: "Want to rent a pet? This project is a pet-renting platform made for an university assignment.",
    keywords: ["mietmiez, rent, pet, cat, dog"],
    generator: "Next.js",
    robots: {},
    icons: {}
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg`}
        >
        {/* Header and children fill the complete screen */}
        <div className="h-screen w-screen">
            <HeaderWrapper/> {/* show header on top of every page */}
            {children} {/* page content itself */}
        </div>
        <Footer/> {/* show footer on the bottom of every page */}
        </body>
        </html>
    );
}
