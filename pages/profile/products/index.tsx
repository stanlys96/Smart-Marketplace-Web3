import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsPersonFill, BsThreeDots } from "react-icons/bs";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import MetaverseMarketplaceABI from "../../../src/helper/MetaverseMarketplaceABI.json";
import MetaverseNFTABI from "../../../src/helper/MetaverseNFTABI.json";
import MetaverseTokenABI from "../../../src/helper/MetaverseTokenABI.json";
import { notification, Popover } from "antd";
import {
  config,
  filterResult,
  formatCurrencyString,
  marketplaceAddress,
} from "@/src/helper/helper";
import { waitForTransactionReceipt } from "wagmi/actions";
import { FidgetSpinner } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { setClickedProduct } from "@/stores/user-slice";

export default function Profile() {
  const { address } = useAccount();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: hash, writeContractAsync } = useWriteContract();
  const [theDataPopOver, setTheDataPopOver] = useState<any>([]);
  const dispatch = useDispatch();
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getUserListing",
    account: address,
  });

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
            src="/gumroad.svg"
            width={157}
            height={22}
            alt="logo"
          />
        </div>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => router.push("/profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <FaHome color={`${hovered ? "#ff90e8" : "#ffffff"}`} size="1.4rem" />
          <p className={`text-[1rem] ${hovered ? "text-pink" : "text-white"}`}>
            Home
          </p>
        </div>
        <div
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          onClick={() => router.push("/user-profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <BsPersonFill
            color={`${hovered2 ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered2 ? "text-pink" : "text-white"}`}>
            Profile
          </p>
        </div>
        <div
          onClick={() => router.push("/profile/products")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <MdShoppingBag color={`#ff90e8`} size={"1.4rem"} />
          <p className={`text-[1rem] text-pink`}>Products</p>
        </div>
      </div>
      <div className="w-full bg-[#F4F4F1]">
        <header className="py-[2rem] flex justify-between w-full flex-col h-[12.5rem] border-b border-b-[#808080] px-[3rem]">
          <div className="flex justify-between w-full items-center">
            <p className="text-black my-[1rem] text-[2.5rem]">Products</p>
            <div className="flex gap-x-3 items-center">
              <button className="border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black">
                <FaSearch size="22px" />
              </button>
              <button
                onClick={() => router.push("/profile/products/new")}
                className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
              >
                New product
              </button>
            </div>
          </div>
          <div>
            <div className="bg-white w-fit color-black border border-black px-[0.75rem] py-[0.5rem] rounded-[10rem]">
              <p>All products</p>
            </div>
          </div>
        </header>
        <div className="p-[64px] main-body overflow-y-auto">
          <p className="text-black text-[24px] mb-[24px] font-medium">
            Products
          </p>
          {(result?.data as any)?.filter(filterResult)?.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th />
                  <th>Name</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(result?.data as any)
                  ?.filter(filterResult)
                  .map((theData: any, index: number) => (
                    <tr key={theData?.productCode}>
                      <td className="icon-cell">
                        <span className="icon icon-card-image-fill"></span>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <p className="font-semibold">{theData?.title}</p>
                          <a
                            className="underline cursor-pointer"
                            target="_blank"
                            href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/product-self/${theData?.productCode}`}
                          >
                            {process.env.NEXT_PUBLIC_FRONTEND_URL}/product-self/
                            {theData?.productUrl}
                          </a>
                        </div>
                      </td>
                      <td>
                        <p>0</p>
                      </td>
                      <td>
                        <p>$0</p>
                      </td>
                      <td>
                        <p>
                          {formatCurrencyString(theData?.price?.toString())}{" "}
                          {theData?.currency}
                        </p>
                      </td>
                      <td>
                        <div className="flex gap-x-1 items-center">
                          <span
                            className={`${
                              theData?.published ? "icon-green" : "icon-black"
                            } icon-circle-fill`}
                          />
                          <p>
                            {theData?.published ? "Published" : "Unpublished"}
                          </p>
                        </div>
                      </td>
                      <td className="w-[5%]">
                        <Popover
                          content={
                            <div className="flex flex-col gap-y-2">
                              <a
                                className="font-bold border-b pb-2"
                                onClick={async () => {
                                  try {
                                    setLoading(true);
                                    const falseArray = new Array(
                                      (result?.data as any).length
                                    ).fill(false);
                                    setTheDataPopOver([...falseArray]);
                                    const secondResponse =
                                      await writeContractAsync({
                                        address: marketplaceAddress ?? "",
                                        abi: MetaverseMarketplaceABI,
                                        functionName: "changeListingVisibility",
                                        args: [
                                          theData?.productCode,
                                          !theData?.published,
                                        ],
                                      });
                                    const transactionReceipt =
                                      await waitForTransactionReceipt(config, {
                                        hash: secondResponse,
                                        confirmations: 2,
                                      });
                                    if (
                                      transactionReceipt?.status === "success"
                                    ) {
                                      notification.success({
                                        message: "Success!",
                                        description:
                                          "You have successfully created a product!",
                                        placement: "topRight",
                                      });
                                      result?.refetch();
                                    }
                                    setLoading(false);
                                  } catch (e) {
                                    setLoading(false);
                                  }
                                }}
                              >
                                {theData?.published ? "Unpublish" : "Publish"}
                              </a>
                              <a
                                onClick={() => {
                                  router.push(
                                    `/profile/products/${theData?.productCode}/edit`
                                  );
                                }}
                                className="font-bold"
                              >
                                Edit Product
                              </a>
                            </div>
                          }
                          trigger="click"
                          open={theDataPopOver[index]}
                          onOpenChange={(newOpen) => {
                            const falseArray = new Array(
                              (result?.data as any).length
                            ).fill(false);
                            let temp = [...falseArray];
                            temp[index] = newOpen;
                            setTheDataPopOver([...temp]);
                          }}
                        >
                          <button className="flex justify-center items-center">
                            <BsThreeDots />
                          </button>
                        </Popover>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="font-bold" colSpan={2}>
                    Totals
                  </td>
                  <td className="font-bold">0</td>
                  <td className="font-bold" colSpan={5}>
                    $0
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <p>You have not created any product yet...</p>
          )}
        </div>
      </div>
    </div>
  );
}
