import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { web3Modal } from "../_app";
import { useRouter } from "next/router";
import { FaStar } from "react-icons/fa";

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
    <div className="h-full">
      <div className="px-[20px] bg-white text-black lg:px-[100px] py-[30px] flex flex-col gap-5 md:h-[25vh]">
        <nav className="flex lg:flex-row flex-col gap-[1rem] items-center flex-1">
          <Image
            className="md:flex-1 md:h-fit"
            src="/gummy-black.svg"
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
        <div className="lg:px-[100px] px-[20px] h-fit py-[30px]">
          <p className="text-[24px] mb-[15px] text-black">{productType}</p>
          <div className="grid lg:grid-cols-4 gap-5">
            <div
              onClick={() => router.push(`/product/${"qjdkasdmi"}`)}
              className="product-card cursor-pointer pb-[10px] flex flex-col items-start justify-center"
            >
              <Image
                layout="contain"
                width={254}
                height={255}
                alt="business"
                src="/habibu.png"
                className="w-full align-middle h-fit"
              />
              <div className="flex flex-col gap-y-4 py-[15px] px-[1rem] border-t border-b border-black w-full">
                <div className="text-ellipsis whitespace-nowrap break-words">
                  <p className="font-semibold truncate h-full whitespace-nowrap break-words">
                    Walao
                  </p>
                </div>
                <div className="flex gap-x-2 items-center">
                  <Image
                    className="rounded-full"
                    width={30}
                    height={30}
                    alt="user"
                    src="/call.png"
                  />
                  <p className="underline">Stanlys96</p>
                </div>
                <div className="flex gap-x-1 items-center">
                  <FaStar />
                  <p>5.0 (808)</p>
                </div>
              </div>
              <div className="px-[1rem] py-[0.5rem] mt-2 flex justify-start w-full">
                <div className="price-container">
                  <div className="product-price">
                    <p>100 ETH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] w-full bg-[#646564]" />
        <footer className="bg-black py-[25px] lg:flex-row flex-col flex gap-5 justify-center items-center">
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
