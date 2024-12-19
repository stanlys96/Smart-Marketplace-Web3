import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect, useReadContract } from "wagmi";
import { web3Modal } from "../../_app";
import { useRouter } from "next/router";
import { FaStar, FaInfoCircle, FaRegStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import MetaverseMarketplaceABI from "../../../src/helper/MetaverseMarketplaceABI.json";
import MetaverseNFTABI from "../../../src/helper/MetaverseNFTABI.json";
import MetaverseTokenABI from "../../../src/helper/MetaverseTokenABI.json";
import { getPinataUrl } from "@/src/helper/helper";

export default function Home() {
  const router = useRouter();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { productCode } = router.query;
  const { address } = useAccount();
  const [currentCategory, setCurrentCategory] = useState<string>("All");
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const { clickedProduct } = useSelector((state: any) => state.user);
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getListingByProductCode",
    account: address,
    args: [productCode],
  });
  const userProfile = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getUserProfile",
    args: [address],
  });
  const currentData = result?.data as any;
  console.log(currentData);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div className="h-full min-h-[100vh]">
      <div className="h-full bg-[#FFFFFF] overflow-y-auto">
        <div className="h-full main-product-container">
          <div className="flex justify-center items-center w-full gap-x-6">
            <Image
              onClick={() => router.push("/")}
              className=" cursor-pointer"
              src="/gummy-black.svg"
              width={157}
              height={22}
              alt="logo"
            />
            <button
              onClick={async () => {
                if (address) {
                  disconnect();
                } else {
                  await web3Modal.open();
                }
              }}
              className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: address
                    ? address?.slice(0, 10) + "..." + address?.slice(35)
                    : `Connect&nbsp;Wallet`,
                }}
              />
            </button>
          </div>
          <div className="main-product-subcontainer">
            <div className="border border-black rounded-[10px]">
              {currentData?.imageUrl && (
                <Image
                  src={
                    currentData?.imageUrl
                      ? getPinataUrl(currentData?.imageUrl ?? "")
                      : "/fitness.svg"
                  }
                  width={100}
                  height={100}
                  className="w-full rounded-t-[10px]"
                  alt="habibu"
                />
              )}
              {currentData?.imageUrl && (
                <div className="w-full h-[1px] bg-black" />
              )}
              <div className="grid grid-cols-3">
                <div className="border-r border-r-black col-span-2">
                  <p className="col-span-2 text-black border-b border-b-black p-[32px] text-[32px] font-bold">
                    {currentData?.title}
                  </p>
                  <div className="flex">
                    <div className="border-r border-r-black border-b border-b-black p-[1rem]">
                      <div className="price-container">
                        <div className="product-price">
                          <p className="">
                            {currentData?.price?.toString()}{" "}
                            {currentData?.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-r h-full border-b border-b-black border-r-black p-[1rem] flex gap-x-2 items-center">
                      <Image
                        className="rounded-full"
                        src={"/audio.svg"}
                        width={30}
                        height={30}
                        alt="user"
                      />
                      <p className="text-black text-[18px] py-[4px] underline">
                        {currentData?.seller?.slice(0, 7) + "..."}
                      </p>
                    </div>
                    <div className="flex-1 p-[1rem] border-b border-b-black items-center flex gap-x-2">
                      <div className="flex gap-x-1">
                        <FaRegStar size="20px" color="black" />
                        <FaRegStar size="20px" color="black" />
                        <FaRegStar size="20px" color="black" />
                        <FaRegStar size="20px" color="black" />
                        <FaRegStar size="20px" color="black" />
                      </div>
                      <p className="text-[18px] text-black">
                        {currentData?.comments?.length} ratings
                      </p>
                    </div>
                  </div>
                  <div className="p-[20px]">
                    <p className="col-span-2 text-black text-[24px] font-medium">
                      {currentData?.description}
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className="mt-[20px] p-[20px] border-b-black border-b">
                    <div className="input-price-product border border-black flex gap-x-2 items-center">
                      <p className="username-p text-black">ETH</p>
                      <input
                        disabled
                        value={"100"}
                        onChange={(e) => {
                          let inputValue = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          if (inputValue.startsWith("0")) {
                            inputValue = inputValue.slice(1);
                          }
                        }}
                        type="text"
                        className="bg-transparent outline-none w-full text-black"
                        placeholder="Price your product"
                      />
                    </div>
                    <button
                      onClick={() => router.push("/profile/products/new")}
                      className="border w-full mt-[20px] button bg-[#ff90e8] text-[#DDDDDD] border-[#000000] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
                    >
                      Buy product
                    </button>
                    <div className="info-container mt-[15px] flex items-center gap-x-2 text-black">
                      <FaInfoCircle size="24px" color="#91A8ED" />
                      <p>
                        <span className="font-bold">
                          {currentData?.buyers?.length}
                        </span>{" "}
                        buys
                      </p>
                    </div>
                  </div>
                  <div className="p-[20px]">
                    <div className="flex justify-between">
                      <p className="text-black font-semibold text-[20px]">
                        Ratings
                      </p>
                      <div className="flex gap-x-2 items-center">
                        <FaRegStar color="black" size="16px" />
                        <p className="text-black">
                          0 ({currentData?.comments?.length} ratings)
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">5 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">4 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">3 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">2 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">
                        1 star &nbsp;&nbsp;
                      </p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center w-fit">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">0%</p>
                    </div>
                    {currentData?.comments?.map((theResult: any) => (
                      <div
                        key={theResult?.comment}
                        className="mt-[30px] flex flex-col gap-y-2"
                      >
                        <div className="flex gap-x-1">
                          <FaStar color="black" size="16px" />
                          <FaStar color="black" size="16px" />
                          <FaStar color="black" size="16px" />
                          <FaStar color="black" size="16px" />
                          <FaStar color="black" size="16px" />
                        </div>
                        <p className="text-black">
                          "{theResult?.comment ?? ""}"
                        </p>
                        <div className="flex gap-x-2 items-center border-b border-b-black pb-[20px]">
                          <Image
                            width={20}
                            height={20}
                            alt="person"
                            src="/drawing.svg"
                            className="rounded-full w-[20px] h-[20px] border border-black"
                          />
                          <p className="text-black">
                            {theResult?.commenter?.slice(0, 7) + "..."}
                          </p>
                          <p className="text-[#00000080]">
                            {theResult?.dateString ?? ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
