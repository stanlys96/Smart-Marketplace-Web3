/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gateway.pinata.cloud", "api.pinata.cloud"],
  },
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-notification",
    "rc-tooltip",
    "rc-tree",
    "rc-table",
    "rc-input/es/utils/commonUtils",
  ],
};

export default nextConfig;
