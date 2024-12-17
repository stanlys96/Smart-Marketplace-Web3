import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  return (
    <div className="flex h-[100vh]">
      <div className="w-[12.8125rem] static bg-black h-full">
        <div className="flex justify-center items-center h-[144px] border-b border-b-[#808080] px-[1.5rem]">
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
        <header className="py-[2rem] flex items-center h-[144px] border-b border-b-[#808080] px-[3rem]">
          <p className="text-black my-[1rem] text-[2.5rem]">
            Welcome to Gumroad.
          </p>
        </header>
        <div className="p-[64px]">
          <div className="grid grid-cols-2 gap-[1rem]">
            <div className="p-[1.5rem] text-[2.5rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Balance</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p>$0</p>
            </div>
            <div className="p-[1.5rem] text-[2.5rem] border border-black rounded-[0.25rem] bg-white">
              <div className="flex gap-x-2 items-center">
                <p className="text-black text-[16px]">Total earnings</p>
                <IoMdInformationCircleOutline size="22px" />
              </div>
              <p>$0</p>
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
