import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

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
        <header className="py-[2rem] flex justify-between w-full flex-col h-[12.5rem] border-b border-b-[#808080] px-[3rem]">
          <div className="flex justify-between w-full items-center">
            <p className="text-black my-[1rem] text-[2.5rem]">Products</p>
            <div className="flex gap-x-3 items-center">
              <button className="border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full p-[1rem] rounded-[0.25rem] cursor-pointer text-black">
                <FaSearch size="22px" />
              </button>
              <button className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full p-[1rem] rounded-[0.25rem] cursor-pointer text-black">
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
        <div className="p-[64px]">
          <p className="text-black text-[24px] mb-[24px] font-medium">
            Products
          </p>
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
              <tr>
                <td className="icon-cell">
                  <span className="icon icon-card-image-fill"></span>
                </td>
                <td>
                  <div className="flex flex-col">
                    <p className="font-semibold">Walao eh</p>
                    <a className="underline cursor-pointer">
                      stanlykwok.gumroad.com/l/lpayog
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
                  <p>$100</p>
                </td>
                <td>
                  <div className="flex gap-x-1 items-center">
                    <span className="icon icon-circle-fill" />
                    <p>Published</p>
                  </div>
                </td>
                <td className="w-[5%]">
                  <button className="flex justify-center items-center">
                    <BsThreeDots />
                  </button>
                </td>
              </tr>
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
        </div>
      </div>
    </div>
  );
}
