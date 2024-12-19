import Image from "next/image";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import { web3Modal } from "./_app";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const [currentCategory] = useState<string>("All");
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
      <div className="px-[20px] lg:px-[100px] py-[30px] flex flex-col gap-5 md:h-[25vh]">
        <nav className="flex lg:flex-row flex-col gap-[1rem] items-center flex-1">
          <Image
            className="md:flex-1 md:h-fit"
            src="/logo-small.png"
            width={157}
            height={22}
            alt="logo"
          />
          <div className="w-full flex items-center gap-x-[0.5rem] rounded-[0.25rem] border border-[#4D4D4D] text-white px-[1rem] bg-black">
            <Image
              className="flex-1 h-fit"
              src="/search-solid.svg"
              width={24}
              height={24}
              alt="logo"
            />
            <input
              className="text-white w-full outline-none bg-transparent h-full py-[1.2rem]"
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
              className="border button text-[#DDDDDD] border-[#4D4D4D] h-fit p-[1rem] rounded-[0.25rem]"
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
                className="bg-[#DDDDDD] h-fit hover:bg-[#FF91E7] border border-[#4D4D4D] selling p-[1rem] rounded-[0.25rem] text-black"
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
                onClick={() => router.push(`/${data?.title}`)}
                role="menuitem"
                key={data?.id}
                aria-current={false}
                aria-haspopup={"menu"}
                aria-expanded={false}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                aria-controls=":Rhc5:"
                className={`text-[#DDD] bg-transparent cursor-pointer ${
                  data?.title === currentCategory && !isHovering && "tupac"
                } linky`}
              >
                {data?.title}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#646564]" />
      <div className="h-[75vh] overflow-y-auto">
        <div className="lg:px-[100px] px-[20px]  py-[30px]">
          <p className="text-[24px] mb-[15px] text-white">
            Products by category
          </p>
          <div className="grid lg:grid-cols-2 gap-5">
            {products?.map((product) => (
              <div
                onClick={() => router.push(`/${product?.title}`)}
                key={product?.id}
                className="button items-start flex gap-x-4 bg-black rounded-[0.25rem] cursor-pointer border border-[#4D4D4D] text-white p-[1rem]"
              >
                <Image
                  className=""
                  src={product?.imgUrl}
                  width={48}
                  height={69}
                  alt="WALAO"
                />
                <div className="flex flex-col gap-y-2">
                  <p className="font-bold text-[24px]">{product?.title}</p>
                  <p>{product?.description}</p>
                </div>
              </div>
            ))}
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
