import { AppProps } from "next/app";
import "../src/app/globals.css";
import "../src/app/secondary.css";
import { WagmiProvider } from "wagmi";
import { liskSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi";
import { defaultWagmiConfig } from "@web3modal/wagmi";
import { Provider } from "react-redux";
import { store } from "@/stores";

const queryClient = new QueryClient({});

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "Smart Marketplace",
  description: "Smart Marketplace",
  url: "https://smart-marketplace-web3.vercel.app",
  icons: [process.env.NEXT_PUBLIC_ICON_URL ?? ""],
};

const chains: any = [liskSepolia];
const config = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID ?? "",
  metadata: metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

export const web3Modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: PROJECT_ID ?? "",
  enableAnalytics: true,
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
