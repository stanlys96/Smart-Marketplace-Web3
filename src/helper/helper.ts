import { defaultWagmiConfig } from "@web3modal/wagmi";
import axios from "axios";
import {
  mainnet,
  arbitrum,
  optimism,
  polygon,
  lisk,
  liskSepolia,
} from "viem/chains";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "Gumroad",
  description: "Gumroad",
  url: "https://gumroad-web3.vercel.app", // origin must match your domain & subdomain
  icons: [process.env.NEXT_PUBLIC_ICON_URL ?? ""],
};

const chains: any = [mainnet, arbitrum, optimism, polygon, lisk, liskSepolia];
export const config = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID ?? "",
  metadata: metadata,
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
});

export const uploadImageToIPFS = async (imageFile: any) => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (e) {
    console.log(e);
  }
};

export const uploadMetadataToIPFS = async (
  name: string,
  description: string,
  imageIPFSHash: string
) => {
  try {
    const metadata = {
      name,
      description,
      image: `https://gateway.pinata.cloud/ipfs/${imageIPFSHash}`,
    };

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_API_SECRET,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (e) {
    console.log(e);
  }
};

export function generateRandomString(length: number = 8): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function formatCurrencyString(value: string): string {
  try {
    const numberValue = parseFloat(value);

    return numberValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    });
  } catch (e) {
    return "0";
  }
}

export const marketplaceAddress: any =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
export const NFTAddress: any = process.env.NEXT_PUBLIC_NFT_ADDRESS;
export const tokenAddress: any =
  process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS;
