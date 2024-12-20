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
import { IoMdPerson } from "react-icons/io";
import { waitForTransactionReceipt } from "wagmi/actions";
import { notification, Modal } from "antd";
import { FidgetSpinner } from "react-loader-spinner";
import { ethers } from "ethers";
import Swal from "sweetalert2";

export default function Home() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const { productCode } = router.query;
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
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
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getListingByProductCode",
    account: account?.address,
    args: [productCode],
  });
  const currentData = result?.data as any;

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
    <div className="h-full min-h-[100vh] relative">
      {loading && (
        <div className="bg-black/50 z-10000000 absolute h-full overflow-auto w-[100vw] flex justify-center items-center">
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
      <div className="px-[20px] bg-white text-black lg:px-[100px] py-[30px] flex flex-col gap-5 md:h-[15vh]">
        <nav className="flex lg:flex-row flex-col gap-[1rem] items-center flex-1">
          <Image
            onClick={() => router.push("/")}
            className="md:flex-1 md:h-fit cursor-pointer"
            src="/logo-small.png"
            width={157}
            height={22}
            alt="logo"
          />
          <div className="w-full flex items-center gap-x-[0.5rem] rounded-[0.25rem] border border-[#4D4D4D] text-white px-[1rem] bg-[#F4F4F0]">
            <Image
              className="flex-1 h-fit"
              src="/search-solid.svg"
              width={24}
              height={24}
              alt="logo"
            />
            <input
              className="text-black w-full outline-none bg-transparent h-full py-[1.2rem]"
              type="text"
              placeholder="Search products"
            />
          </div>
          <div className="flex gap-x-2 items-center">
            <button
              onClick={async () => {
                if (account?.address) {
                  disconnect();
                } else {
                  await web3Modal.open();
                }
              }}
              className="border button text-black border-[#4D4D4D] h-fit p-[1rem] rounded-[0.25rem]"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: account?.address
                    ? account?.address?.slice(0, 10) +
                      "..." +
                      account?.address?.slice(35)
                    : `Connect&nbsp;Wallet`,
                }}
              />
            </button>
            {account?.address && (
              <button
                onClick={() => router.push("/profile")}
                className="bg-[#F4F4F0] h-fit hover:bg-[#FF91E7] border border-[#4D4D4D] selling p-[1rem] rounded-[0.25rem] text-black"
              >
                Start&nbsp;selling
              </button>
            )}
          </div>
        </nav>
      </div>
      <div className="h-[1px] w-full bg-[#646564]" />
      <div className="min-h-[85vh] bg-[#29222A] overflow-y-auto">
        <div className="h-full main-product-container">
          <div className="main-product-subcontainer">
            <div className="border border-white rounded-[10px]">
              {currentData?.imageUrl && (
                <Image
                  src={getPinataUrl(currentData?.imageUrl)}
                  width={100}
                  height={100}
                  className="w-full rounded-t-[10px]"
                  alt="habibu"
                />
              )}
              {currentData?.imageUrl && (
                <div className="h-[1px] w-full bg-white" />
              )}
              <div className="grid grid-cols-3">
                <div className="border-r border-r-white col-span-2">
                  <p className="col-span-2 text-white border-b border-b-white p-[32px] text-[32px] font-bold">
                    {currentData?.title ?? ""}
                  </p>
                  <div className="flex">
                    <div className="border-r border-r-white border-b border-b-white p-[1rem]">
                      <div className="price-container">
                        <div className="product-price-white white-border">
                          <p>
                            {ethers?.formatUnits(
                              currentData?.price?.toString() ?? "0",
                              "ether"
                            )}{" "}
                            {currentData?.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="border-r h-full border-b border-b-white border-r-white p-[1rem] flex gap-x-2 items-center">
                      <div className="bg-black p-[5px] rounded-full">
                        <IoMdPerson color="white" size="30px" />
                      </div>
                      <p className="text-white text-[24px] underline">
                        {currentData?.seller?.slice(0, 7) + "..."}
                      </p>
                    </div>
                    <div className="flex-1 p-[1rem] border-b border-b-white items-center flex gap-x-2">
                      <div className="flex gap-x-1">
                        <FaRegStar size="20px" color="white" />
                        <FaRegStar size="20px" color="white" />
                        <FaRegStar size="20px" color="white" />
                        <FaRegStar size="20px" color="white" />
                        <FaRegStar size="20px" color="white" />
                      </div>
                      <p className="text-[18px] text-white">
                        {currentData?.comments?.length ?? 0} ratings
                      </p>
                    </div>
                  </div>
                  <div className="p-[20px]">
                    <p className="col-span-2 text-white text-[24px] font-medium">
                      {currentData?.description ?? ""}
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className="mt-[20px] p-[20px] border-b-white border-b">
                    <div className="input-price-product-transparent border flex gap-x-2 items-center">
                      <p className="username-p-transparent">
                        {currentData?.currency ?? ""}
                      </p>
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
                        className="bg-transparent outline-none w-full text-white"
                        placeholder="Price your product"
                      />
                    </div>
                    <button
                      disabled={loading}
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const secondResponse = await writeContractAsync({
                            address: marketplaceAddress ?? "",
                            abi: MetaverseMarketplaceABI,
                            functionName: "buyItem",
                            args: [productCode, currentData?.seller, 1],
                            value: currentData?.price?.toString(),
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
                                "You have successfully bought the item!",
                              placement: "topRight",
                            });
                            result?.refetch();
                          }
                          setLoading(false);
                        } catch (e) {
                          setLoading(false);
                          console.log(e);
                        }
                      }}
                      className="border w-full mt-[20px] button bg-[#ff90e8] text-[#DDDDDD] border-[#FFFFFF] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
                    >
                      Buy product
                    </button>
                    <div className="info-container mt-[15px] flex items-center gap-x-2 text-white">
                      <FaInfoCircle size="24px" color="#91A8ED" />
                      <p>
                        <span className="font-bold">
                          {currentData?.buyers?.length ?? 0}
                        </span>{" "}
                        buys
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (currentData?.seller === account?.address) {
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
                            currentData?.comments?.[i]?.commenter ===
                            account?.address
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
                      <p className="text-white font-semibold text-[20px]">
                        Ratings
                      </p>
                      <div className="flex gap-x-2 items-center">
                        <FaStar color="white" size="16px" />
                        <p className="text-white">
                          0 ({currentData?.comments?.length ?? 0} ratings)
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-white text-[1rem]">5 stars</p>
                      <div className="flex border-white border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-white w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-white text-[1rem]">4 stars</p>
                      <div className="flex border-white border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-white w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-white text-[1rem]">3 stars</p>
                      <div className="flex border-white border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-white w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-white text-[1rem]">2 stars</p>
                      <div className="flex border-white border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-white w-[35px]">0%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-white text-[1rem]">
                        1 star &nbsp;&nbsp;
                      </p>
                      <div className="flex border-white border flex-1 rounded-[5px] gap-x-2 items-center w-fit">
                        <div className="bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-white w-[35px]">0%</p>
                    </div>
                    {(currentData?.comments as any)?.map(
                      (theData: any, index: any) => (
                        <div
                          key={theData?.comment}
                          className="mt-[30px] flex flex-col gap-y-2"
                        >
                          <div className="flex gap-x-1">
                            <FaStar color="white" size="16px" />
                            <FaStar color="white" size="16px" />
                            <FaStar color="white" size="16px" />
                            <FaStar color="white" size="16px" />
                            <FaStar color="white" size="16px" />
                          </div>
                          <p className="text-white">
                            &quot;{theData?.comment}&quot;
                          </p>
                          <div
                            className={`flex gap-x-2 items-center ${
                              index !==
                                (currentData?.comments as any)?.length - 1 &&
                              "border-b border-b-white"
                            }  pb-[20px]`}
                          >
                            <Image
                              width={20}
                              height={20}
                              alt="person"
                              src="/drawing.svg"
                              className="rounded-full w-[20px] h-[20px] border border-white"
                            />
                            <p className="text-white">
                              {theData?.commenter?.slice(0, 7) + "..."}
                            </p>
                            <p className="text-[#FFFFFF80]">
                              {theData?.dateString}
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
