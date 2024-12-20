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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pinFileToIPFS`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
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

export function getPinataUrl(value: string): string {
  return `https://gateway.pinata.cloud/ipfs/${value}`;
}

export const filterResult = (theData: any) => {
  return theData?.title;
};

export const getCurrentFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

export const marketplaceAddress: any =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
export const NFTAddress: any = process.env.NEXT_PUBLIC_NFT_ADDRESS;
export const tokenAddress: any =
  process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS;
