import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function Edit() {
  const router = useRouter();
  const { productCode } = router.query;
  const { newProduct } = useSelector((state: any) => state.user);
  const [hovered, setHovered] = useState(false);
  const [productName, setProductName] = useState(newProduct?.name);
  const [description, setDescription] = useState("");
  return (
    <div className="flex h-[100vh]">
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
                onClick={() => router.push("/profile/products/new")}
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
              <p>Description</p>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-[10px] input-name-product"
                placeholder="Product description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
