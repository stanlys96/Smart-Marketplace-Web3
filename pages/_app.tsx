import { AppProps } from "next/app";
import "../src/app/globals.css";
import "../src/app/secondary.css";
import { WagmiProvider } from "wagmi";
// import { arbitrum, bsc, optimism, polygon, mainnet } from 'viem/chains'
import {
  mainnet,
  arbitrum,
  optimism,
  polygon,
  lisk,
  liskSepolia,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { metaMask, injected, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from "@web3modal/wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi";
import { Provider } from "react-redux";
import { store } from "@/stores";

// "@wagmi/connectors": "^5.1.8",
// "@web3modal/wagmi": "^5.1.4",

const queryClient = new QueryClient({});

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "Gumroad",
  description: "Gumroad",
  url: "https://gumroad-web3.vercel.app", // origin must match your domain & subdomain
  icons: [process.env.NEXT_PUBLIC_ICON_URL ?? ""],
};

const chains: any = [mainnet, arbitrum, optimism, polygon, lisk, liskSepolia];
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
      <Provider store={store}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </>
  );
}

export default MyApp;
