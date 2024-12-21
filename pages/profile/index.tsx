import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome, FaStar } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline, IoMdPerson } from "react-icons/io";
import { useEffect, useState } from "react";
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useBalance,
} from "wagmi";
import {
  config,
  formatCurrencyString,
  getAverageRating,
  getPinataUrl,
  getTotalEarnings,
  marketplaceAddress,
} from "../../src/helper/helper";
import MetaverseMarketplaceABI from "../../src/helper/MetaverseMarketplaceABI.json";
import { FidgetSpinner } from "react-loader-spinner";
import { waitForTransactionReceipt } from "wagmi/actions";
import { BsPersonFill } from "react-icons/bs";
import { Empty, notification } from "antd";
import { ethers } from "ethers";
import Swal from "sweetalert2";

export default function Profile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const currentBalance = useBalance({ address: address });
  const currentMettBalance = useBalance({
    address: address,
    token:
      (process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS as any) ??
      "0x0000000000000000000000000000000000000000",
  });
  const [domLoaded, setDomLoaded] = useState(false);
  const proceedsResult = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getProceeds",
    account: address,
    args: [address, "ETH"],
  });

  const userListingResult = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getUserListing",
    account: address,
  });

  const currentUserSales = (userListingResult?.data as any)?.filter(
    (result: any) => result?.title && result?.buyers?.length > 0
  );

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  useEffect(() => {}, []);
  if (!domLoaded) return <div></div>;
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
        <div
          onClick={() => router.push("/")}
          className="flex cursor-pointer justify-center items-center h-[9rem] border-b border-b-[#808080] px-[1.5rem]"
        >
          <Image
            className="flex-1 h-fit"
            src="/logo-small.png"
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
          onClick={() => router.push("/user-profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <BsPersonFill
            color={`${hovered ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered ? "text-pink" : "text-white"}`}>
            Profile
          </p>
        </div>
        <div
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          onClick={() => router.push("/profile/products")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <MdShoppingBag
            color={`${hovered2 ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered2 ? "text-pink" : "text-white"}`}>
            Products
          </p>
        </div>
      </div>
      <div className="w-full bg-[#F4F4F1]">
        <header className="py-[2rem] flex items-center justify-between h-[9rem] border-b border-b-[#808080] px-[3rem]">
          <p className="text-black my-[1rem] text-[2.5rem]">
            Welcome to Smart Marketplace.
          </p>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const secondResponse = await writeContractAsync({
                  address: marketplaceAddress ?? "",
                  abi: MetaverseMarketplaceABI,
                  functionName: "get1000MetaverseToken",
                });
                const transactionReceipt = await waitForTransactionReceipt(
                  config,
                  {
                    hash: secondResponse,
                    confirmations: 4,
                  }
                );
                if (transactionReceipt?.status === "success") {
                  notification.success({
                    message: "Success!",
                    description:
                      "You have successfully received 1000 Metaverse Token!",
                    placement: "topRight",
                  });
                  currentMettBalance?.refetch();
                }
                setLoading(false);
              } catch (e: any) {
                Swal.fire(
                  "Airdrop Collected!",
                  "You have collected your airdrop for the day, please wait for 24 hours after the time claimed.",
                  "info"
                );
                setLoading(false);
              }
            }}
            className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-fit px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
          >
            Airdrop 1000 METT
          </button>
        </header>
        <div className="pt-[32px] px-[32px] main-body overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            <div className="p-[1.5rem] flex flex-col justify-between text-[1.5rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center mb-[10px]">
                <p className="text-black text-[16px]">Balance</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p className="font-bold">
                {currentBalance?.data?.formatted?.slice(0, 6)} ETH
              </p>
              <p className="font-bold">
                {formatCurrencyString(
                  currentMettBalance?.data?.formatted ?? "0"
                )}{" "}
                METT
              </p>
            </div>
            <div className="p-[1.5rem] flex flex-col justify-between text-[1.5rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Total earnings</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p className="font-bold">
                {getTotalEarnings(currentUserSales)} ETH
              </p>
            </div>
            <div className="p-[1.5rem] flex flex-col justify-between text-[1.5rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Total proceeds</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold">
                  {ethers?.formatUnits(
                    proceedsResult?.data?.toString() ?? "0",
                    "ether"
                  )}{" "}
                  ETH
                </p>
                <button
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const secondResponse = await writeContractAsync({
                        address: marketplaceAddress ?? "",
                        abi: MetaverseMarketplaceABI,
                        functionName: "withdrawProceeds",
                        args: ["ETH"],
                      });
                      const transactionReceipt =
                        await waitForTransactionReceipt(config, {
                          hash: secondResponse,
                          confirmations: 4,
                        });
                      if (transactionReceipt?.status === "success") {
                        notification.success({
                          message: "Success!",
                          description:
                            "You have successfully withdrawn all your ETH proceeds!",
                          placement: "topRight",
                        });
                        proceedsResult?.refetch();
                        currentBalance?.refetch();
                      }
                      setLoading(false);
                    } catch (e) {
                      setLoading(false);
                      console.log(e);
                    }
                  }}
                  className="border button text-[14px] bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="mt-[25px]">
            <p className="text-[32px] font-bold">Best Sales</p>
            <div
              className={`flex flex-wrap gap-5 h-full mt-[10px] pb-[40px] w-full`}
            >
              {currentUserSales?.length > 0 ? (
                currentUserSales.map(
                  (theResult: any) =>
                    theResult?.buyers?.length > 0 && (
                      <a
                        key={theResult?.productCode}
                        target="_blank"
                        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/product-self/${theResult?.productCode}`}
                        className="product-card cursor-pointer pb-[10px] flex flex-col items-start justify-center"
                      >
                        <Image
                          layout="contain"
                          width={100}
                          height={100}
                          alt="business"
                          src={
                            theResult?.imageUrl
                              ? getPinataUrl(theResult?.imageUrl ?? "")
                              : "/audio.svg"
                          }
                          className="w-[200px] h-full rounded-t-[0.25rem]"
                        />
                        <div className="flex flex-col gap-y-4 py-[15px] px-[1rem] border-t border-b border-black w-full">
                          <div className="text-ellipsis whitespace-nowrap break-words">
                            <p className="font-semibold truncate h-full whitespace-nowrap break-words">
                              {theResult?.title ?? ""}
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-x-1 items-center">
                              <FaStar className="text-yellow-500" />
                              <p>
                                {getAverageRating(theResult?.comments ?? [])} (
                                {theResult?.comments?.length ?? 0})
                              </p>
                            </div>
                            <p>
                              <span className="font-bold">
                                {theResult?.buyers?.length ?? 0}
                              </span>{" "}
                              buys
                            </p>
                          </div>
                        </div>
                        <div className="px-[1rem] py-[0.5rem] mt-2 flex justify-start w-full">
                          <div className="price-container">
                            <div className="product-price">
                              <p>
                                {ethers.formatUnits(
                                  theResult?.price?.toString(),
                                  "ether"
                                )}{" "}
                                {theResult?.currency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    )
                )
              ) : (
                <div className="flex justify-center items-center flex-col w-full gap-y-2">
                  <Empty />
                  <p className="text-[20px] font-medium">
                    You have not made any sales...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
