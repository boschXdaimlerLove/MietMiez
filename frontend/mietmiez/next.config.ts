import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    pageExtensions: [
        'tsx',
        // FIXME: Next.js has a bug which does not resolve not-found.page.tsx correctly
        // Instead, use `not-found.ts` as a workaround
        // "ts" is required to resolve `not-found.ts`
        // https://github.com/vercel/next.js/issues/65447
        "ts",
    ],
    images: {
        remotePatterns: [
            new URL('https://images.unsplash.com/**'),
        ],
    }
};

export default nextConfig;
