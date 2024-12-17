import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { LuCircleX } from "react-icons/lu";

export default function Profile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
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
        <header className="py-[2rem] flex justify-between w-full flex-col h-[9rem] border-b border-b-[#808080] px-[3rem]">
          <div className="flex justify-between w-full items-center">
            <p className="text-black my-[1rem] text-[2.5rem]">
              What are you creating?
            </p>
            <div className="flex gap-x-3 items-center">
              <button className="flex gap-x-2 items-center border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black">
                <LuCircleX />
                <span>Cancel</span>
              </button>
              <button className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black">
                Next: Customize
              </button>
            </div>
          </div>
        </header>
        <div className="p-[64px]">
          <div className="grid grid-cols-3 gap-4">
            <p className="text-black text-[16px] mb-[24px] font-medium">
              Turn your idea into a live product in minutes. No fuss, just a few
              quick selections and you&apos;re ready to start selling. Whether
              it&apos;s digital downloads, physical goods, or subscriptions -
              see what sticks.
            </p>
            <div className="col-span-2">
              <p>Name</p>
              <input
                className="mt-[10px] input-name-product"
                type="text"
                placeholder="Name of product"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
