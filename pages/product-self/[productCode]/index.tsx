import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { web3Modal } from "../../_app";
import { useRouter } from "next/router";
import { FaStar, FaInfoCircle } from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { productType } = router.query;
  const account = useAccount();
  const [currentCategory, setCurrentCategory] = useState<string>("All");
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [domLoaded, setDomLoaded] = useState<boolean>(false);
  const categories = [
    {
      id: 1,
      title: "All",
    },
    {
      id: 2,
      title: "Digital product",
    },
    {
      id: 3,
      title: "Course or tutorial",
    },
    {
      id: 4,
      title: "E-book",
    },
    {
      id: 5,
      title: "Membership",
    },
    {
      id: 6,
      title: "Bundle",
    },
    {
      id: 7,
      title: "Commission",
    },
    {
      id: 8,
      title: "Call",
    },
    {
      id: 9,
      title: "Coffee",
    },
  ];
  const products = [
    {
      id: 1,
      title: "Digital product",
      description:
        "Perfect your craft with the same tools used at Dreamworks and Pixar.",
      imgUrl: "/product.png",
      attributes: {
        creators: "16K",
        products: "93K",
        sales: "21M",
      },
    },
    {
      id: 2,
      title: "Course or tutorial",
      imgUrl: "/course.png",
      description:
        "Code, design, and ship your dream product with these technical resources.",
      attributes: {
        creators: "24K",
        products: "98K",
        sales: "31M",
      },
    },
    {
      id: 3,
      title: "E-book",
      imgUrl: "/ebook.png",
      description:
        "Tutorials, plugins, and brushes from pro concept artists and illustrators.",
      attributes: {
        creators: "19K",
        products: "115K",
        sales: "27M",
      },
    },
    {
      id: 4,
      title: "Membership",
      imgUrl: "/membership.png",
      description:
        "Learn to code and tools to help you code more productively.",
      attributes: {
        creators: "10K",
        products: "36K",
        sales: "11M",
      },
    },
    {
      id: 5,
      title: "Bundle",
      imgUrl: "/bundle.png",
      description:
        "Move your body and your audience with guides, videos, and more.",
      attributes: {
        creators: "18K",
        products: "52K",
        sales: "9M",
      },
    },
    {
      id: 6,
      title: "Commission",
      imgUrl: "/commission.png",
      description:
        "Whether you're looking to shed or shred, here are coaches to pump you up.",
      attributes: {
        creators: "5K",
        products: "14K",
        sales: "1M",
      },
    },
    {
      id: 7,
      title: "Call",
      imgUrl: "/call.png",
      description:
        "Tracks, beats, and loops from the best musicians and engineers in the biz.",
      attributes: {
        creators: "11K",
        products: "80K",
        sales: "10M",
      },
    },
    {
      id: 8,
      title: "Coffee",
      imgUrl: "/coffee.png",
      description:
        "Get snapping with pro presets, stock imagery, and digi darkroom needs.",
      attributes: {
        creators: "8K",
        products: "68K",
        sales: "4M",
      },
    },
  ];
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div className="h-full min-h-[100vh]">
      <div className="h-full bg-[#FFFFFF] overflow-y-auto">
        <div className="h-full main-product-container">
          <div className="flex justify-center items-center w-full">
            <button
              onClick={async () => {
                if (account?.address) {
                  disconnect();
                } else {
                  await web3Modal.open();
                }
              }}
              className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
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
          </div>
          <div className="main-product-subcontainer">
            <div className="border border-black rounded-[10px]">
              <Image
                src="/habibu.png"
                width={100}
                height={100}
                className="w-full rounded-t-[10px]"
                alt="habibu"
              />
              <div className="grid grid-cols-3">
                <div className="border-r border-r-black col-span-2">
                  <p className="col-span-2 text-black border-b border-b-black p-[32px] text-[32px] font-bold">
                    Laser Pointer (VRCHAT) - FREE
                  </p>
                  <div className="flex">
                    <div className="border-r border-r-black border-b border-b-black p-[1rem]">
                      <div className="price-container">
                        <div className="product-price">
                          <p className="">100 ETH</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-r h-full border-b border-b-black border-r-black p-[1rem] flex gap-x-2 items-center">
                      <Image
                        className="rounded-full"
                        src="/gaming.svg"
                        width={30}
                        height={30}
                        alt="user"
                      />
                      <p className="text-black text-[24px] underline">
                        stanlys96
                      </p>
                    </div>
                    <div className="flex-1 p-[1rem] border-b border-b-black items-center flex gap-x-2">
                      <div className="flex gap-x-1">
                        <FaStar size="20px" color="black" />
                        <FaStar size="20px" color="black" />
                        <FaStar size="20px" color="black" />
                        <FaStar size="20px" color="black" />
                        <FaStar size="20px" color="black" />
                      </div>
                      <p className="text-[18px] text-black">1104 ratings</p>
                    </div>
                  </div>
                  <div className="p-[20px]">
                    <p className="col-span-2 text-black text-[24px] font-medium">
                      WALAO EH
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
                        <span className="font-bold">1,000</span> buys
                      </p>
                    </div>
                  </div>
                  <div className="p-[20px]">
                    <div className="flex justify-between">
                      <p className="text-black font-semibold text-[20px]">
                        Ratings
                      </p>
                      <div className="flex gap-x-2 items-center">
                        <FaStar color="black" size="16px" />
                        <p className="text-black">5 (1.1K ratings)</p>
                      </div>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">5 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="w-full bg-[#ff90e8] h-full rounded-[5px] w-[98%]"></div>
                      </div>
                      <p className="text-black w-[35px]">98%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">4 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="w-full bg-[#ff90e8] h-full rounded-[5px] w-[2%]"></div>
                      </div>
                      <p className="text-black w-[35px]">2%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">3 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="w-full bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">2%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">2 stars</p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center">
                        <div className="w-full bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">2%</p>
                    </div>
                    <div className="flex justify-between gap-x-2 mt-[10px]">
                      <p className="text-black text-[1rem]">
                        1 star &nbsp;&nbsp;
                      </p>
                      <div className="flex border-black border flex-1 rounded-[5px] gap-x-2 items-center w-fit">
                        <div className="w-full bg-[#ff90e8] h-full rounded-[5px] w-[0%]"></div>
                      </div>
                      <p className="text-black w-[35px]">2%</p>
                    </div>
                    <div className="mt-[30px] flex flex-col gap-y-2">
                      <div className="flex gap-x-1">
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                      </div>
                      <p className="text-black">"fire asset :3"</p>
                      <div className="flex gap-x-2 items-center border-b border-b-black pb-[20px]">
                        <Image
                          width={20}
                          height={20}
                          alt="person"
                          src="/drawing.svg"
                          className="rounded-full w-[20px] h-[20px] border border-black"
                        />
                        <p className="text-black">Taffy</p>
                        <p className="text-[#00000080]">3 days ago</p>
                      </div>
                    </div>
                    <div className="mt-[15px] flex flex-col gap-y-2">
                      <div className="flex gap-x-1">
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                        <FaStar color="black" size="16px" />
                      </div>
                      <p className="text-black">"fire asset :3"</p>
                      <div className="flex gap-x-2 items-center border-b border-b-black pb-[20px]">
                        <Image
                          width={20}
                          height={20}
                          alt="person"
                          src="/drawing.svg"
                          className="rounded-full w-[20px] h-[20px] border border-black"
                        />
                        <p className="text-black">Taffy</p>
                        <p className="text-[#00000080]">3 days ago</p>
                      </div>
                    </div>
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
