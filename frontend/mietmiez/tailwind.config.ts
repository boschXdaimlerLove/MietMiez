import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./src/app/**/*.{ts,tsx}",
        "./src/components/**/*.{ts,tsx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                primaryBtn: "var(--primaryBtn)",
                card: "var(--card)",
            },
            fontFamily: {
                'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
                'mono': ['var(--font-jetbrains-mono)', 'monospace'],
            },
        },
    },
    plugins: [],
};

export default config;
