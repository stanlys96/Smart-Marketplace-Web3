import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { useState } from "react";
import { LuCircleX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { setNewProduct } from "@/stores/user-slice";
import { generateRandomString } from "../../../../src/helper/helper";
import { BsPersonFill } from "react-icons/bs";
import CurrencyInput from "react-currency-input-field";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [selected, setSelected] = useState("Digital product");
  const [currency, setCurrency] = useState("ETH");
  const [price, setPrice] = useState("");
  const [productName, setProductName] = useState("");

  const productsData = [
    {
      id: 1,
      imgUrl: "/product.png",
      title: "Digital product",
      description: "Any set of files to download or stream.",
    },
    {
      id: 2,
      imgUrl: "/course.png",
      title: "Course or tutorial",
      description: "Sell a single lesson or teach a whole cohort of students.",
    },
    {
      id: 3,
      imgUrl: "/ebook.png",
      title: "E-book",
      description: "Offer a book or comic in PDF, ePub, and Mobi formats.",
    },
    {
      id: 4,
      imgUrl: "/membership.png",
      title: "Membership",
      description: "Start a membership business around your fans.",
    },
    {
      id: 5,
      imgUrl: "/bundle.png",
      title: "Bundle",
      description: "Sell two or more existing products for a new price",
    },
  ];
  const servicesData = [
    {
      id: 1,
      imgUrl: "/commission.png",
      title: "Commission",
      description: "Sell unique tailored work or services to your customers.",
    },
    {
      id: 2,
      imgUrl: "/call.png",
      title: "Call",
      description: "Offer scheduled calls with your customers",
    },
    {
      id: 3,
      imgUrl: "/coffee.png",
      title: "Coffee",
      description: "Boost your support and accept tips from customers.",
    },
  ];
  return (
    <div className="flex h-[100vh]">
      <div className="w-[12.8125rem] static bg-black h-full">
        <div
          onClick={() => router.push("/")}
          className="flex cursor-pointer justify-center items-center h-[9rem] border-b border-b-[#808080] px-[1.5rem]"
        >
          <Image
            className="flex-1 h-fit"
            src="/logo-small.png"
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
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          onClick={() => router.push("/user-profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <BsPersonFill
            color={`${hovered2 ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered2 ? "text-pink" : "text-white"}`}>
            Profile
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
      <div className="w-full bg-[#F4F4F1] h-min-[100vh] overflow-y-auto">
        <header className="py-[2rem] flex justify-between w-full flex-col h-[9rem] border-b border-b-[#808080] px-[3rem]">
          <div className="flex justify-between w-full items-center">
            <p className="text-black my-[1rem] text-[2.5rem]">
              What are you creating?
            </p>
            <div className="flex gap-x-3 items-center">
              <button
                onClick={() => {
                  router.push("/profile/products");
                }}
                className="flex gap-x-2 items-center border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
              >
                <LuCircleX />
                <span>Cancel</span>
              </button>
              <button
                onClick={() => {
                  try {
                    if (!productName) {
                      return Swal.fire({
                        title: "Input not filled",
                        text: "Please fill in the name of the product.",
                        icon: "info",
                      });
                    }
                    if (!price) {
                      return Swal.fire({
                        title: "Input not filled",
                        text: "Please fill in the name of the product.",
                        icon: "info",
                      });
                    }
                    if (parseFloat(price) === 0) {
                      return Swal.fire({
                        title: "Price value",
                        text: "Please enter price more than 0",
                        icon: "info",
                      });
                    }
                    const productCode = generateRandomString();
                    dispatch(
                      setNewProduct({
                        code: productCode,
                        name: productName,
                        price: parseFloat(price),
                        currency: currency,
                        type: selected,
                      })
                    );
                    router.push(`/profile/products/${productCode}/edit`);
                  } catch (e) {
                    console.log(e);
                    Swal.fire({
                      title: "Error",
                      text: "There's an error.",
                      icon: "error",
                    });
                  }
                }}
                className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
              >
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
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="mt-[10px] input-name-product"
                type="text"
                placeholder="Name of product"
              />
              <p className="mt-[15px] font-semibold text-[18px]">Products</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                {productsData?.map((product, index) =>
                  selected === product?.title ? (
                    <div
                      onClick={() => setSelected(product?.title)}
                      key={product.id}
                      className="special-product p-[15px] bg-white mt-[10px] flex flex-col gap-y-2"
                    >
                      <Image
                        src={product?.imgUrl}
                        width={40}
                        height={40}
                        alt="product"
                      />
                      <div>
                        <p className="text-[18px] font-semibold">
                          {product?.title}
                        </p>
                        <p className="text-[1rem]">{product?.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelected(product?.title)}
                      key={product.id}
                      className="pt-[10px]"
                    >
                      <button className="flex flex-col gap-y-2 p-[15px] items-start border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full rounded-[0.25rem] cursor-pointer text-black">
                        <Image
                          src={product.imgUrl}
                          width={40}
                          height={40}
                          alt="product"
                        />
                        <div>
                          <p className="text-[18px] text-left font-semibold">
                            {product.title}
                          </p>
                          <p className="text-[1rem] text-left">
                            {product.description}
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                )}
              </div>
              <p className="mt-[15px] font-semibold text-[18px]">Services</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px]">
                {servicesData?.map((service, index) =>
                  selected === service?.title ? (
                    <div
                      onClick={() => setSelected(service?.title)}
                      key={service.id}
                      className="special-product p-[15px] bg-white mt-[10px] flex flex-col gap-y-2"
                    >
                      <Image
                        src={service?.imgUrl}
                        width={40}
                        height={40}
                        alt="service"
                      />
                      <div>
                        <p className="text-[18px] font-semibold">
                          {service?.title}
                        </p>
                        <p className="text-[1rem]">{service?.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelected(service?.title)}
                      key={service.id}
                      className="pt-[10px]"
                    >
                      <button className="flex flex-col gap-y-2 p-[15px] items-start border button h-full text-[#DDDDDD] border-[#4D4D4D] h-full rounded-[0.25rem] cursor-pointer text-black">
                        <Image
                          src={service.imgUrl}
                          width={40}
                          height={40}
                          alt="service"
                        />
                        <div>
                          <p className="text-[18px] text-left font-semibold">
                            {service.title}
                          </p>
                          <p className="text-[1rem] text-left">
                            {service.description}
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="mt-[20px]">
                <p>Price</p>
                <div className="input-price-product border mt-[10px] flex gap-x-2 items-center">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="currency-selector"
                  >
                    <option value="ETH">ETH</option>
                  </select>
                  <CurrencyInput
                    id="input-example"
                    name="input-name"
                    placeholder="Price your product"
                    value={price}
                    defaultValue={0}
                    decimalsLimit={6}
                    onFocus={undefined}
                    onKeyUp={undefined}
                    onSubmit={undefined}
                    onSubmitCapture={undefined}
                    onChangeCapture={undefined}
                    transformRawValue={(value: any) => {
                      if (value[value.length - 1] === ",") {
                        return value + ".";
                      }
                      return value;
                    }}
                    onValueChange={(e: any) => {
                      setPrice(e);
                    }}
                    type="text"
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
