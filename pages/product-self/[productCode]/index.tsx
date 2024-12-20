import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { web3Modal } from "../../_app";
import { useRouter } from "next/router";
import { FaStar, FaInfoCircle, FaRegStar } from "react-icons/fa";
import MetaverseMarketplaceABI from "../../../src/helper/MetaverseMarketplaceABI.json";
import {
  config,
  getCurrentFormattedDateTime,
  getPinataUrl,
  marketplaceAddress,
} from "../../../src/helper/helper";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import { Modal, notification } from "antd";
import { waitForTransactionReceipt } from "wagmi/actions";

export default function Home() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { productCode } = router.query;
  const { address } = useAccount();
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getListingByProductCode",
    account: address,
    args: [productCode],
  });
  const currentData = result?.data as any;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [addCommentLoading, setAddCommentLoading] = useState(false);

  const handleClick = (value: any) => {
    if (addCommentLoading) return;
    setRating(value);
  };

  const handleMouseEnter = (value: any) => {
    if (addCommentLoading) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (addCommentLoading) return;
    setHoverRating(0);
  };

  const handleCancel = () => {
    if (addCommentLoading) return;
    setIsModalOpen(false);
    setComment("");
    setRating(0);
  };

  const handleOk = async () => {
    try {
      if (!comment || rating <= 0 || addCommentLoading) return;
      setAddCommentLoading(true);
      const currentDateString = getCurrentFormattedDateTime();
      const secondResponse = await writeContractAsync({
        address: marketplaceAddress ?? "",
        abi: MetaverseMarketplaceABI,
        functionName: "addComment",
        args: [
          comment,
          rating,
          currentDateString,
          productCode,
          currentData?.seller,
        ],
      });
      const transactionReceipt = await waitForTransactionReceipt(config, {
        hash: secondResponse,
        confirmations: 2,
      });
      if (transactionReceipt?.status === "success") {
        notification.success({
          message: "Success!",
          description: "You have successfully added your comment!",
          placement: "topRight",
        });
        result?.refetch();
      }
      setAddCommentLoading(false);
      setIsModalOpen(false);
      setRating(0);
      setComment("");
    } catch (e) {
      console.log(e, "<< ");
      setAddCommentLoading(false);
    }
  };

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
              src="/logo-small.png"
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
                            {ethers?.formatUnits(
                              currentData?.price?.toString() ?? "0",
                              "ether"
                            )}{" "}
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
                  <div className={`mt-[20px] p-[20px] border-b-black border-b`}>
                    <div className="input-price-product border border-black flex gap-x-2 items-center">
                      <p className="username-p text-black">ETH</p>
                      <input
                        disabled
                        value={ethers?.formatUnits(
                          currentData?.price?.toString() ?? "0",
                          "ether"
                        )}
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
                      onClick={() => {
                        if (currentData?.seller === address) {
                          return Swal.fire(
                            "Your own product!",
                            "Can't buy your own product!",
                            "info"
                          );
                        }
                      }}
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
                    <button
                      onClick={() => {
                        if (currentData?.seller === address) {
                          return Swal.fire(
                            "Your own product!",
                            "Can not comment on your own product!",
                            "info"
                          );
                        }
                        for (
                          let i = 0;
                          i < (currentData?.comments?.length ?? 0);
                          i++
                        ) {
                          if (
                            currentData?.comments?.[i]?.commenter === address
                          ) {
                            return Swal.fire(
                              "You have commented on this product!",
                              "You can only comment once per product!",
                              "info"
                            );
                          }
                        }
                        setIsModalOpen(true);
                      }}
                      className="bg-[#F4F4F0] w-full mt-[15px] h-fit hover:bg-[#FF91E7] border border-[#4D4D4D] selling p-[1rem] rounded-[0.25rem] text-black"
                    >
                      Add rating
                    </button>
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
                    {currentData?.comments?.map(
                      (theResult: any, index: any) => (
                        <div
                          key={theResult?.comment}
                          className="mt-[30px] flex flex-col gap-y-2"
                        >
                          <div className="flex gap-x-1">
                            {[...Array(5)].map((_, index) =>
                              index < theResult?.rating ? (
                                <FaStar key={index} color="black" size="16px" />
                              ) : (
                                <FaRegStar
                                  key={index}
                                  color="black"
                                  size="16px"
                                />
                              )
                            )}
                          </div>
                          <p className="text-black">
                            &quot;{theResult?.comment ?? ""}&quot;
                          </p>
                          <div
                            className={`flex gap-x-2 items-center ${
                              index !== currentData?.comments?.length - 1 &&
                              "border-b border-b-black"
                            } pb-[20px]`}
                          >
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
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Add your rating and comment"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={addCommentLoading}
        onClose={handleCancel}
      >
        <div className="flex flex-col gap-y-3">
          <div className="mt-[10px] flex justify-center">
            {Array.from({ length: 5 }, (_, index) => {
              const currentValue = index + 1;
              return currentValue <= (hoverRating || rating) ? (
                <div
                  onMouseEnter={() => handleMouseEnter(currentValue)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(currentValue)}
                  className="px-1"
                >
                  <FaStar
                    color="#5E648C"
                    className="cursor-pointer"
                    size="22px"
                  />
                </div>
              ) : (
                <div
                  onMouseEnter={() => handleMouseEnter(currentValue)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(currentValue)}
                  className="px-1"
                >
                  <FaRegStar size="22px" className="cursor-pointer" />
                </div>
              );
            })}
          </div>
          <div>
            <input
              disabled={addCommentLoading}
              className="input-username text-black w-full"
              type="text"
              value={comment}
              onChange={(e) => {
                if (addCommentLoading) return;
                setComment(e.target.value);
              }}
              placeholder="Enter your comment"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
