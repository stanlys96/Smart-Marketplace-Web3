import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  config,
  marketplaceAddress,
  NFTAddress,
  tokenAddress,
  uploadImageToIPFS,
  uploadMetadataToIPFS,
} from "@/src/helper/helper";
import { FidgetSpinner } from "react-loader-spinner";
import MetaverseMarketplaceABI from "../../../../src/helper/MetaverseMarketplaceABI.json";
import MetaverseNFTABI from "../../../../src/helper/MetaverseNFTABI.json";
import MetaverseTokenABI from "../../../../src/helper/MetaverseTokenABI.json";
import {
  useWriteContract,
  useReadContract,
  useTransactionReceipt,
  useAccount,
} from "wagmi";
import { notification } from "antd";
import { waitForTransactionReceipt } from "@wagmi/core";

export default function Edit() {
  const fileInputRef = useRef(null);

  const router = useRouter();
  const { productCode } = router.query;
  const { newProduct } = useSelector((state: any) => state.user);
  const [hovered, setHovered] = useState(false);
  const [productName, setProductName] = useState(newProduct?.name);
  const [description, setDescription] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productInfo, setProductInfo] = useState("");
  const [price, setPrice] = useState(newProduct?.price);
  const [fileImage, setFileImage] = useState<any>();
  const [previewUrl, setPreviewUrl] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { data: hash, writeContractAsync } = useWriteContract();
  const mintNFTResult = useTransactionReceipt({
    hash: hash,
  });
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "productCodeExists",
    args: [productCode],
  });
  const [productExists, setProductExists] = useState(result?.data);
  const createTokenURI = async (
    name: string,
    description: string,
    imageFile: any
  ) => {
    try {
      const imageIPFSHash = await uploadImageToIPFS(imageFile);

      const metadataIPFSHash = await uploadMetadataToIPFS(
        name,
        description,
        imageIPFSHash
      );

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataIPFSHash}`;
      return { tokenURI, imageUrl: imageIPFSHash };
    } catch (error) {
      console.error("Error creating Token URI:", error);
      throw new Error("Error creating Token URI");
    }
  };

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
            <p className="text-black my-[1rem] text-[2.5rem]">
              {newProduct?.name}
            </p>
            <div className="flex gap-x-3 items-center">
              <button
                disabled={loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const result = await createTokenURI(
                      productName,
                      description,
                      fileImage ?? ""
                    );
                    const firstResponse = await writeContractAsync({
                      address: NFTAddress ?? "",
                      abi: MetaverseNFTABI,
                      functionName: "mintNFT",
                      args: [result?.tokenURI],
                    });
                    const secondResponse = await writeContractAsync({
                      address: marketplaceAddress ?? "",
                      abi: MetaverseMarketplaceABI,
                      functionName: "listItem",
                      args: [
                        price,
                        newProduct?.type,
                        productName,
                        description,
                        result?.imageUrl,
                        newProduct?.currency,
                        productUrl ? productUrl : productCode,
                        productInfo,
                        productCode,
                        1,
                      ],
                    });
                    const transactionReceipt = await waitForTransactionReceipt(
                      config,
                      {
                        hash: secondResponse,
                        confirmations: 2,
                      }
                    );
                    console.log(transactionReceipt);
                    if (transactionReceipt?.status === "success") {
                      notification.success({
                        message: "Success!",
                        description: "You have successfully created a product!",
                        placement: "topRight",
                      });
                      router.push("/profile/products");
                    }
                    setLoading(false);
                  } catch (e) {
                    setLoading(false);
                    console.log(e);
                  }
                }}
                className="border hover:bg-[#ff90e8] bg-black hover:text-black text-white button border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
              >
                Save and continue
              </button>
            </div>
          </div>
          <div>
            <div className="bg-white w-fit color-black border border-black px-[0.75rem] py-[0.5rem] rounded-[10rem]">
              <p>Product</p>
            </div>
          </div>
        </header>
        <div className="p-[64px] main-body overflow-y-auto">
          <div className="">
            <div>
              <p>Name</p>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-[10px] input-name-product"
                type="text"
                placeholder="Name of product"
              />
            </div>
            <div className="mt-[20px]">
              <p>Description</p>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-[10px] input-name-product"
                placeholder="Product description"
              />
            </div>
            <div className="mt-[20px]">
              <p>URL</p>
              <div className="input-price-product border mt-[10px] flex gap-x-2 items-center">
                <p className="username-p w-fit">stanlys96.gumroad.com/l/</p>
                <input
                  value={productUrl}
                  onChange={(e) => {
                    if (e.target.value[e.target.value.length - 1] === " ")
                      return;
                    setProductUrl(e.target.value);
                  }}
                  type="text"
                  className="bg-transparent outline-none w-full"
                  placeholder={(productCode as any) ?? ""}
                />
              </div>
            </div>
            <div className="h-[1px] w-full bg-black my-[50px]" />
            <p className="text-[28px] mb-[20px]">Cover</p>
            <div className="file-placeholder flex-col gap-y-3">
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }} // Hides the file input
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e?.target?.files?.[0];
                  if (file) {
                    setFileImage(file);
                    const reader = new FileReader();
                    reader.onload = () => {
                      setPreviewUrl(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {fileImage ? (
                <Image
                  src={previewUrl}
                  width={400}
                  height={400}
                  alt="FileImage"
                />
              ) : (
                <div className="flex flex-col gap-y-3 items-center justify-center">
                  <button
                    onClick={() => {
                      (fileInputRef?.current as any)?.click();
                    }}
                    className="border hover:bg-[#ff90e8] bg-black hover:text-black text-white button border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
                  >
                    Upload image
                  </button>
                  <p>
                    Image should be horizontal, at least 1280x720px, and 72 DPI
                    (dots per inch).
                  </p>
                </div>
              )}
            </div>
            <div className="h-[1px] w-full bg-black my-[50px]" />
            <p className="text-[28px] mb-[20px]">Product info</p>
            <div>
              <p>Summary</p>
              <input
                value={productInfo}
                onChange={(e) => setProductInfo(e.target.value)}
                className="mt-[10px] input-name-product"
                type="text"
                placeholder="Name of product"
              />
            </div>
            <div className="h-[1px] w-full bg-black my-[50px]" />
            <p className="text-[28px] mb-[20px]">Pricing</p>
            <div className="mt-[20px]">
              <p>Price</p>
              <div className="input-price-product border mt-[10px] flex gap-x-2 items-center">
                <p className="username-p">{newProduct?.currency}</p>
                <input
                  value={price}
                  onChange={(e) => {
                    let inputValue = e.target.value.replace(/[^0-9]/g, "");
                    if (inputValue.startsWith("0")) {
                      inputValue = inputValue.slice(1);
                    }
                    setPrice(inputValue);
                  }}
                  type="text"
                  className="bg-transparent outline-none w-full"
                  placeholder="Price your product"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}