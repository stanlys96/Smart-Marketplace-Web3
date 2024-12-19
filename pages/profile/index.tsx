import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import {
  useReadContract,
  useBalance,
  useAccount,
  useWriteContract,
} from "wagmi";
import { config, marketplaceAddress } from "@/src/helper/helper";
import MetaverseMarketplaceABI from "../../src/helper/MetaverseMarketplaceABI.json";
import MetaverseNFTABI from "../../src/helper/MetaverseNFTABI.json";
import MetaverseTokenABI from "../../src/helper/MetaverseTokenABI.json";
import { notification } from "antd";
import { FidgetSpinner } from "react-loader-spinner";
import { getBalance } from "wagmi/actions";

export default function Profile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const [currentETHBalance, setCurrentETHBalance] = useState("");
  const [currentMETTBalance, setCurrentMETTBalance] = useState("");
  const [currentLSKBalance, setCurrentLSKBalance] = useState("");
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getUsername",
  });
  const theBalance = getBalance(config, {
    address: address as any,
  });
  const mettBalance = getBalance(config, {
    address: address as any,
    token: process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS as any,
  });
  const lskBalance = getBalance(config, {
    address: address as any,
    token: "0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D",
  });

  useEffect(() => {
    theBalance?.then((result) => {
      setCurrentETHBalance(result?.formatted);
    });
    mettBalance?.then((result) => {
      setCurrentMETTBalance(result?.formatted);
    });
    lskBalance?.then((result) => {
      setCurrentLSKBalance(result?.formatted);
    });
  }, []);
  return (
    <div className="flex h-[100vh]">
      {loading && (
        <div className="bg-black/50 z-1000 absolute h-[100vh] w-[100vw] flex justify-center items-center">
          <div className="flex flex-col gap-y-4 items-center justify-center">
            <FidgetSpinner
              visible={true}
              height="160"
              width="160"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper"
            />
            <p className="text-white font-bold text-[24px] text-center">
              Loading...
            </p>
          </div>
        </div>
      )}
      <div className="w-[12.8125rem] static bg-black h-full">
        <div className="flex justify-center items-center h-[9rem] border-b border-b-[#808080] px-[1.5rem]">
          <Image
            className="flex-1 h-fit"
            src="/gumroad.svg"
            width={157}
            height={22}
            alt="logo"
          />
        </div>
        <div
          onClick={() => router.push("/profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <FaHome color="#ff90e8" size="22px" />
          <p className="text-[1rem] text-pink">Home</p>
        </div>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => router.push("/profile/products")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <MdShoppingBag
            color={`${hovered ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered ? "text-pink" : "text-white"}`}>
            Products
          </p>
        </div>
      </div>
      <div className="w-full bg-[#F4F4F1]">
        <header className="py-[2rem] flex items-center h-[9rem] border-b border-b-[#808080] px-[3rem]">
          <p className="text-black my-[1rem] text-[2.5rem]">
            Welcome to Gumroad.
          </p>
        </header>
        <div className="p-[64px]">
          <p className="mb-[10px] text-black text-[24px] font-semibold">
            Username
          </p>
          <div className="flex gap-x-2 items-center mb-[24px] ">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-username"
              type="text"
              placeholder="Type your username"
              maxLength={25}
            />
            <button
              disabled={loading}
              onClick={async () => {
                if (!username?.trim()) return;
                setLoading(true);
                try {
                  const firstResponse = await writeContractAsync({
                    address: marketplaceAddress,
                    abi: MetaverseMarketplaceABI,
                    functionName: "setUsername",
                    args: [username?.trim()],
                  });
                  console.log(firstResponse);
                  setLoading(false);
                  notification.success({
                    message: "Success!",
                    description: "You have successfully updated your username!",
                    placement: "topRight",
                  });
                } catch (e) {
                  setLoading(false);
                  console.log(e);
                }
              }}
              className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
            >
              Submit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-[1rem]">
            <div className="p-[1.5rem] text-[2rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Balance</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p>{currentETHBalance?.slice(0, 6)} ETH</p>
              <p>{currentLSKBalance?.slice(0, 6)} LSK</p>
              <p>{currentMETTBalance} METT</p>
            </div>
            <div className="p-[1.5rem] text-[2rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Total earnings</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p>0 ETH</p>
              <p>0 LSK</p>
              <p>0 METT</p>
            </div>
          </div>
          <p className="text-black text-[24px] mt-[24px] font-semibold">
            Best selling
          </p>
        </div>
      </div>
    </div>
  );
}
