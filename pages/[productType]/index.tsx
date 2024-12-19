import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useReadContract } from "wagmi";
import { web3Modal } from "../_app";
import { useRouter } from "next/router";
import { FaStar } from "react-icons/fa";
import MetaverseMarketplaceABI from "../../src/helper/MetaverseMarketplaceABI.json";
import { getPinataUrl } from "../../src/helper/helper";
import { IoMdPerson } from "react-icons/io";
import { ethers } from "ethers";

export default function Home() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { productType } = router.query;
  const account = useAccount();
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
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getListingByProductType",
    account: account?.address,
    args: [productType],
  });
  const filterForMarketplace = (theData: any) => {
    return (
      theData?.title &&
      theData?.published &&
      theData?.seller !== account?.address
    );
  };
  const finalData = (result?.data as any)?.filter(filterForMarketplace);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div className="h-full">
      <div className="px-[20px] bg-white text-black lg:px-[100px] py-[30px] flex flex-col gap-5 md:h-[25vh]">
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
        <div className="hidden lg:flex">
          {categories.map((data) => (
            <div key={data?.id} className="popover">
              <button
                onClick={() => {
                  if (data?.title === "All") {
                    router.push("/");
                  } else {
                    router.push(`/${data?.title}`);
                  }
                }}
                role="menuitem"
                key={data?.id}
                aria-current={false}
                aria-haspopup={"menu"}
                aria-expanded={false}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                aria-controls=":Rhc5:"
                className={`bg-transparent hover:text-white cursor-pointer ${
                  data?.title === productType && !isHovering && "tupac habibu"
                } linky `}
              >
                {data?.title}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#646564]" />
      <div className="h-[75vh] bg-[#F4F4F0] overflow-y-auto">
        <div className="lg:px-[100px] px-[20px] py-[30px]">
          <p className="text-[24px] mb-[15px] text-black">{productType}</p>
          <div
            className={`${
              finalData?.length > 0 ? "grid lg:grid-cols-4" : ""
            } gap-5 h-full`}
          >
            {finalData?.length > 0 ? (
              finalData.map((theResult: any, index: number) => (
                <div
                  key={theResult?.productCode}
                  onClick={() =>
                    router.push(`/product/${theResult?.productCode}`)
                  }
                  className="product-card cursor-pointer pb-[10px] flex flex-col items-start justify-center"
                >
                  <Image
                    layout="contain"
                    width={254}
                    height={255}
                    alt="business"
                    src={
                      theResult?.imageUrl
                        ? getPinataUrl(theResult?.imageUrl ?? "")
                        : "/audio.svg"
                    }
                    className="w-full align-middle h-[200px] rounded-t-[0.25rem]"
                  />
                  <div className="flex flex-col gap-y-4 py-[15px] px-[1rem] border-t border-b border-black w-full">
                    <div className="text-ellipsis whitespace-nowrap break-words">
                      <p className="font-semibold truncate h-full whitespace-nowrap break-words">
                        {theResult?.title ?? ""}
                      </p>
                    </div>
                    <div className="flex gap-x-2 items-center">
                      <div className="bg-black p-[5px] rounded-full">
                        <IoMdPerson color="white" size="28px" />
                      </div>
                      <p className="underline">
                        {theResult?.seller?.slice(0, 7) + "..."}
                      </p>
                    </div>
                    <div className="flex gap-x-1 items-center">
                      <FaStar />
                      <p>0 ({theResult?.comments?.length ?? 0})</p>
                    </div>
                  </div>
                  <div className="px-[1rem] py-[0.5rem] mt-2 flex justify-start w-full">
                    <div className="price-container">
                      <div className="product-price">
                        <p>
                          {ethers.formatUnits(
                            theResult?.price?.toString(),
                            "ether"
                          )}{" "}
                          {theResult?.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full mb-auto flex justify-center items-center flex-col">
                <Image
                  src="/self-improvement.svg"
                  width={450}
                  height={100}
                  alt="walao"
                />
                <p className="text-black font-bold text-[22px]">
                  This product type is currently empty...
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#646564]" />
        <footer className="bg-black py-[25px] mt-auto lg:flex-row flex-col flex gap-5 justify-center items-center">
          <p className="text-center text-[18px] lg:text-[24px] text-white">
            With Gumroad, anyone can earn their first dollar online.
          </p>
          {account?.address && (
            <button className="bg-[#FF91E7] hover:bg-[#FF91E7] border border-[#4D4D4D] selling-2 px-[1rem] py-[0.75rem] rounded-[0.25rem] text-black">
              Start&nbsp;selling →
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
