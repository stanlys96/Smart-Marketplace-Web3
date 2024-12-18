import Image from "next/image";
import { useEffect, useState } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { web3Modal } from "./_app";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
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
      title: "Design",
    },
    {
      id: 3,
      title: "Drawing & Painting",
    },
    {
      id: 4,
      title: "3D",
    },
    {
      id: 5,
      title: "Self Improvement",
    },
    {
      id: 6,
      title: "Music & Sound Design",
    },
    {
      id: 7,
      title: "Films",
    },
  ];
  const products = [
    {
      id: 1,
      title: "3D",
      description:
        "Perfect your craft with the same tools used at Dreamworks and Pixar.",
      imgUrl: "/3d.svg",
      attributes: {
        creators: "16K",
        products: "93K",
        sales: "21M",
      },
    },
    {
      id: 2,
      title: "Design",
      imgUrl: "/design.svg",
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
      title: "Drawing & Painting",
      imgUrl: "/drawing.svg",
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
      title: "Software Development",
      imgUrl: "/software.svg",
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
      title: "Self Improvement",
      imgUrl: "/self-improvement.svg",
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
      title: "Fitness & Health",
      imgUrl: "/fitness.svg",
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
      title: "Music & Sound Design",
      imgUrl: "/music.svg",
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
      title: "Photography",
      imgUrl: "/photography.svg",
      description:
        "Get snapping with pro presets, stock imagery, and digi darkroom needs.",
      attributes: {
        creators: "8K",
        products: "68K",
        sales: "4M",
      },
    },
    {
      id: 9,
      title: "Writing & Publishing",
      imgUrl: "/writing.svg",
      description:
        "Fill your brain with words and wisdom from creative authors and storytellers.",
      attributes: {
        creators: "19K",
        products: "75K",
        sales: "6M",
      },
    },
    {
      id: 10,
      title: "Business & Money",
      imgUrl: "/business.svg",
      description: "Learn to earn in an increasingly unpredictable world.",
      attributes: {
        creators: "18K",
        products: "38K",
        sales: "5M",
      },
    },
    {
      id: 11,
      title: "Education",
      imgUrl: "/education.svg",
      description:
        "Pick up a new skill with courses and guides from world-class pros.",
      attributes: {
        creators: "24K",
        products: "106K",
        sales: "16M",
      },
    },
    {
      id: 12,
      title: "Comics & Graphic Novels",
      description:
        "Sequential art with loads of heart. Welcome to a paradise of panels",
      imgUrl: "/comic.svg",
      attributes: {
        creators: "6K",
        products: "35K",
        sales: "4M",
      },
    },
    {
      id: 13,
      title: "Fiction Books",
      description:
        "Short stories, novellas, and epic tomes full of interesting characters and worlds.",
      imgUrl: "/fiction.svg",
      attributes: {
        creators: "2K",
        products: "5K",
        sales: "303K",
      },
    },
    {
      id: 14,
      title: "Audio",
      description:
        "Open your ears and mint to interviews, meditations, and true crime thrillers.",
      imgUrl: "/audio.svg",
      attributes: {
        creators: "2K",
        products: "13K",
        sales: "734K",
      },
    },
    {
      id: 15,
      title: "Recorded Music",
      description:
        "Tracks and albums from the best musicians and artists in the biz.",
      imgUrl: "/recorded.svg",
      attributes: {
        creators: "660",
        products: "2K",
        sales: "167K",
      },
    },
    {
      id: 16,
      title: "Films",
      description:
        "Have a movie night with some of the best stories to hit the small screen.",
      imgUrl: "/films.svg",
      attributes: {
        creators: "8K",
        products: "93K",
        sales: "9M",
      },
    },
    {
      id: 17,
      title: "Gaming",
      description:
        "Explore new worlds from the world's most creative indie developers.",
      imgUrl: "/gaming.svg",
      attributes: {
        creators: "6K",
        products: "39K",
        sales: "6M",
      },
    },
    {
      id: 18,
      title: "Other",
      imgUrl: "/other.svg",
      attributes: {
        creators: "104K",
        products: "448K",
        sales: "34M",
      },
    },
  ];
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div>
      <div className="px-[20px] lg:px-[100px] py-[30px] flex flex-col gap-5">
        <nav className="flex lg:flex-row flex-col gap-[1rem] items-center flex-1">
          <Image
            className="flex-1 h-fit"
            src="/gumroad.svg"
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
          <button
            onClick={async () => {
              if (account?.address) {
                disconnect();
              } else {
                await web3Modal.open();
              }
            }}
            className="border button text-[#DDDDDD] border-[#4D4D4D] h-full p-[1rem] rounded-[0.25rem]"
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
              className="bg-[#DDDDDD] hover:bg-[#FF91E7] border border-[#4D4D4D] selling p-[1rem] rounded-[0.25rem] text-black"
            >
              Start&nbsp;selling
            </button>
          )}
        </nav>
        <div className="hidden lg:flex">
          {categories.map((data) => (
            <div key={data?.id} className="popover">
              <button
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
      <div className="lg:px-[100px] px-[20px] py-[30px]">
        <p className="text-[24px] mb-[15px] text-white">Products by category</p>
        <div className="grid lg:grid-cols-2 gap-5">
          {products?.map((product) => (
            <div
              key={product?.id}
              className="button items-start flex gap-x-4 bg-black rounded-[0.25rem] cursor-pointer border border-[#4D4D4D] text-white p-[1rem]"
            >
              <Image
                className=""
                src={product?.imgUrl}
                width={96}
                height={69}
                alt="WALAO"
              />
              <div className="flex flex-col gap-y-2">
                <p className="font-bold text-[24px]">{product?.title}</p>
                <p>{product?.description}</p>
                <div className="flex items-start  gap-2 lg:flex-row flex-col lg:items-center">
                  <div className="flex gap-x-2">
                    <Image
                      className="text-white"
                      src="/person.svg"
                      width={24}
                      height={24}
                      alt="walao"
                    />
                    <span className="text-[#6F6F6F]">
                      {product?.attributes?.creators} creators
                    </span>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      className="text-white"
                      src="/product.svg"
                      width={24}
                      height={24}
                      alt="walao"
                    />
                    <span className="text-[#6F6F6F]">
                      {product?.attributes?.products} products
                    </span>
                  </div>
                  <div className="flex gap-x-2">
                    <Image
                      className="text-white"
                      src="/money.svg"
                      width={24}
                      height={24}
                      alt="walao"
                    />
                    <span className="text-[#6F6F6F]">
                      {product?.attributes?.sales} sales
                    </span>
                  </div>
                </div>
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
  );
}
