import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    // headers: async () => [
    //     {
    //         // matching all API routes
    //         source: "/api/:path*",
    //         headers: [
    //             { key: "Access-Control-Allow-Credentials", value: "true" },
    //             { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
    //             { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
    //             { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
    //         ]
    //     }
    //     ],
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
