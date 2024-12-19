import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { IoMdInformationCircleOutline, IoMdPerson } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import {
  useReadContract,
  useBalance,
  useAccount,
  useWriteContract,
} from "wagmi";
import {
  config,
  marketplaceAddress,
  uploadImageToIPFS,
} from "@/src/helper/helper";
import MetaverseMarketplaceABI from "../../src/helper/MetaverseMarketplaceABI.json";
import MetaverseNFTABI from "../../src/helper/MetaverseNFTABI.json";
import MetaverseTokenABI from "../../src/helper/MetaverseTokenABI.json";
import { FidgetSpinner } from "react-loader-spinner";
import { getBalance, waitForTransactionReceipt } from "wagmi/actions";
import { BsPersonFill } from "react-icons/bs";
import { notification } from "antd";

const urlToFile = async (url: any, filename: any, mimeType: any) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
};

export default function Profile() {
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: hash, writeContractAsync } = useWriteContract();
  const [currentETHBalance, setCurrentETHBalance] = useState("");
  const [currentMETTBalance, setCurrentMETTBalance] = useState("");
  const [currentLSKBalance, setCurrentLSKBalance] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domLoaded, setDomLoaded] = useState(false);
  const [fileImage, setFileImage] = useState<any>();
  const [previewUrl, setPreviewUrl] = useState<any>();
  const [imageUrl, setImageUrl] = useState<any>();
  const [imageChanged, setImageChanged] = useState<any>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const result = useReadContract({
    abi: MetaverseMarketplaceABI,
    address: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as any,
    functionName: "getUserProfile",
    args: [address],
  });
  const [username, setUsername] = useState("");
  const theBalance = getBalance(config, {
    address: address ?? "0x0000000000000000000000000000000000000000",
  });
  const mettBalance = getBalance(config, {
    address: address ?? "0x0000000000000000000000000000000000000000",
    token:
      process.env.NEXT_PUBLIC_METAVERSE_TOKEN_ADDRESS ??
      "0x0000000000000000000000000000000000000000",
  });
  const lskBalance = getBalance(config, {
    address: address ?? "0x0000000000000000000000000000000000000000",
    token: "0x8a21CF9Ba08Ae709D64Cb25AfAA951183EC9FF6D",
  });

  useEffect(() => {
    theBalance
      ?.then((result) => {
        setCurrentETHBalance(result?.formatted);
      })
      .catch((err) => {
        console.log(err);
      });
    mettBalance
      ?.then((result) => {
        setCurrentMETTBalance(result?.formatted);
      })
      .catch((err) => {
        console.log(err);
      });
    lskBalance
      ?.then((result) => {
        setCurrentLSKBalance(result?.formatted);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setDomLoaded(true);
    result.refetch().then((theResult) => {
      console.log(theResult);
      setUsername(theResult?.data?.username);
      setPreviewUrl(theResult?.data?.profileImageUrl);
    });
  }, []);
  if (!domLoaded) return <div></div>;
  return (
    <div className="flex h-[100vh]">
      {loading && (
        <div className="bg-black/50 z-1000 absolute h-[100vh] w-[100vw] flex justify-center items-center">
          <div className="flex flex-col gap-y-4 items-center justify-center">
            <FidgetSpinner
              visible={true}
              height="160"
              width="160"
              ariaLabel="fidget-spinner-loading"
              wrapperStyle={{}}
              wrapperClass="fidget-spinner-wrapper"
            />
            <p className="text-white font-bold text-[24px] text-center">
              Loading...
            </p>
          </div>
        </div>
      )}
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
          <FaHome color={`${hovered ? "#ff90e8" : "#ffffff"}`} size="22px" />
          <p className={`text-[1rem] ${hovered ? "text-pink" : "text-white"}`}>
            Home
          </p>
        </div>
        <div
          onClick={() => router.push("/user-profile")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <BsPersonFill color={`#ff90e8`} size="22px" />
          <p className={`text-[1rem] text-pink`}>Profile</p>
        </div>
        <div
          onMouseEnter={() => setHovered2(true)}
          onMouseLeave={() => setHovered2(false)}
          onClick={() => router.push("/profile/products")}
          className="py-[1rem] cursor-pointer flex gap-x-[10px] items-center border-b border-b-[#808080] px-[1.5rem]"
        >
          <MdShoppingBag
            color={`${hovered2 ? "#ff90e8" : "#ffffff"}`}
            size="22px"
          />
          <p className={`text-[1rem] ${hovered2 ? "text-pink" : "text-white"}`}>
            Products
          </p>
        </div>
      </div>
      <div className="w-full bg-[#F4F4F1]">
        <header className="py-[2rem] flex items-center justify-between h-[9rem] border-b border-b-[#808080] px-[3rem]">
          <p className="text-black my-[1rem] text-[2.5rem]">Your Profile</p>
          <button
            disabled={loading}
            onClick={async () => {
              if (!fileImage && !username) return;
              try {
                setLoading(true);
                let imageIPFSHash;
                if (imageChanged) {
                  imageIPFSHash = await uploadImageToIPFS(fileImage);
                }
                const secondResponse = await writeContractAsync({
                  address: marketplaceAddress ?? "",
                  abi: MetaverseMarketplaceABI,
                  functionName: "setUserProfile",
                  args: [
                    username,
                    imageChanged
                      ? `https://gateway.pinata.cloud/ipfs/${imageIPFSHash}`
                      : previewUrl,
                  ],
                });
                const transactionReceipt = await waitForTransactionReceipt(
                  config,
                  {
                    hash: secondResponse,
                    confirmations: 2,
                  }
                );
                if (transactionReceipt?.status === "success") {
                  notification.success({
                    message: "Success!",
                    description: "You have successfully updated your profile!",
                    placement: "topRight",
                  });
                }
                setLoading(false);
              } catch (e) {
                setLoading(false);
              }
            }}
            className="border button bg-[#ff90e8] text-[#DDDDDD] border-[#4D4D4D] h-fit px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
          >
            Update Profile
          </button>
        </header>
        <div className="p-[64px]">
          <p className="mb-[10px] text-black text-[24px] font-semibold">
            Profile
          </p>
          <p className="mb-[15px]">Username</p>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-username text-black w-full"
            type="text"
            placeholder="Username"
            maxLength={25}
          />
          <p className="my-[15px]">Logo</p>
          <div className="file-placeholder flex-col gap-y-3 w-fit">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }} // Hides the file input
              ref={fileInputRef}
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                if (file) {
                  setFileImage(file);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setPreviewUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                  setImageChanged(true);
                }
              }}
            />
            {previewUrl ? (
              <a
                className="cursor-pointer"
                onClick={() => (fileInputRef?.current as any)?.click()}
              >
                <Image
                  src={previewUrl}
                  width={400}
                  height={400}
                  alt="FileImage"
                />
              </a>
            ) : (
              <div className="flex flex-col gap-y-3 items-center justify-center">
                <button
                  onClick={() => {
                    (fileInputRef?.current as any)?.click();
                  }}
                  className="border hover:bg-[#ff90e8] bg-black hover:text-black text-white button border-[#4D4D4D] h-full px-[1rem] py-[0.75rem] rounded-[0.25rem] cursor-pointer text-black"
                >
                  Upload image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
