import { AppProps } from "next/app";
import "../src/app/globals.css";
import { WagmiProvider } from "wagmi";
// import { arbitrum, bsc, optimism, polygon, mainnet } from 'viem/chains'
import { mainnet, arbitrum, optimism, polygon } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { metaMask, injected, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from "@web3modal/wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi";

const queryClient = new QueryClient();

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "Gumroad",
  description: "Gumroad",
  url: "https://gumroad-web3.vercel.app", // origin must match your domain & subdomain
  icons: [process.env.NEXT_PUBLIC_ICON_URL ?? ""],
};

const chains = [mainnet, arbitrum, optimism, polygon];
const config = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID ?? "",
  metadata: metadata,
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: PROJECT_ID ?? "",
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
