import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // Optional x402 payment modules pulled in transitively by
    // @coinbase/cdp-sdk (via wagmi's baseAccount connector) are not
    // installed and are not used by this app — stub them out.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/evm": false,
      "@x402/core": false,
      "@x402/svm": false,
      // MetaMask SDK optionally imports React Native storage on web — stub it.
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ipfs.io" },
      { protocol: "https", hostname: "gateway.pinata.cloud" },
    ],
  },
};

export default nextConfig;
