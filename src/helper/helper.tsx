import { defaultWagmiConfig } from "@web3modal/wagmi";
import axios from "axios";
import { ethers } from "ethers";
import { FaStar } from "react-icons/fa";
import {
  mainnet,
  arbitrum,
  optimism,
  polygon,
  lisk,
  liskSepolia,
} from "viem/chains";

type RatingProps = {
  rating: number | string;
};

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "Smart Marketplace",
  description: "Smart Marketplace",
  url: "https://smart-marketplace-web3.vercel.app", // origin must match your domain & subdomain
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

export function getAverageRating(comments: any): string {
  try {
    if (!Array.isArray(comments) || comments.length === 0) return "0"; // Handle invalid or empty array case

    const totalRating = comments.reduce(
      (sum: number, comment: any) => sum + parseFloat(comment?.rating || "0"),
      0
    );

    const average = totalRating / comments.length;

    // Check if the average has decimals
    return average % 1 === 0 ? average.toFixed(0) : average.toFixed(2);
  } catch (e) {
    console.error("Error calculating average rating:", e);
    return "0";
  }
}

export function getTotalEarnings(userListingData: any): string {
  return userListingData?.reduce(
    (sum: number, data: any) =>
      sum +
      data?.buyers?.reduce(
        (buyersSum: number, buyerData: any) =>
          buyersSum +
          parseFloat(buyerData?.quantity?.toString()) *
            parseFloat(
              ethers?.formatUnits(buyerData?.totalPrice?.toString(), "ether")
            ),
        0
      ),
    0
  );
}

export function getStarRatingsWidth(allComments: any, rating: number): string {
  try {
    if (!Array.isArray(allComments) || allComments.length === 0) return "0"; // Handle invalid or empty input

    let totalCount = 0;
    for (let i = 0; i < allComments.length; i++) {
      if (allComments[i]?.rating?.toString() === rating?.toString()) {
        totalCount++;
      }
    }

    const percentage = (totalCount / allComments.length) * 100;

    return percentage.toFixed(0);
  } catch (e) {
    console.error("Error calculating star ratings width:", e);
    return "0";
  }
}

export const StarRating: React.FC<RatingProps> = ({ rating }) => {
  if (typeof rating === "string") {
    rating = parseFloat(rating);
  }
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <div key={i} className="relative">
            <FaStar className="text-yellow-500" />
          </div>
        );
      } else if (i === Math.ceil(rating)) {
        const fillPercentage = (rating % 1) * 100;
        stars.push(
          <div key={i} className="relative">
            <FaStar className="text-gray-300" />
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <FaStar className="text-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <div key={i} className="relative">
            <FaStar className="text-gray-300" />
          </div>
        );
      }
    }
    return stars;
  };

  return <div className="flex space-x-1">{renderStars()}</div>;
};

export const marketplaceAddress: any =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
export const NFTAddress: any = process.env.NEXT_PUBLIC_NFT_ADDRESS;
export const tokenAddress: any =
  process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS;
