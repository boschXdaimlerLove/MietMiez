import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    pageExtensions: [
        'page.tsx',
        // FIXME: Next.js has a bug which does not resolve not-found.page.tsx correctly
        // Instead, use `not-found.tsx` as a workaround
        // "ts" is required to resolve `not-found.tsx`
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
