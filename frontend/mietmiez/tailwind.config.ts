import type {Config} from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                primaryBtn: "var(--primaryBtn)",
                card: "var(--card)",
            },
        },
    },
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./globals.css",
    ],
};

export default config;
