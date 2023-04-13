/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import React from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchUsers from "../components/modals/SearchUsers";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadModal from "./modals/UploadModal";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import Settings from "./Settings";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function LefBar() {
  const router = useRouter();
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="h-screen p-4 border-r w-20 lg:w-64">
      <div className="flex items-center justify-center lg:justify-start">
        <Image
          className="hidden lg:block"
          src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
          width={120}
          height={100}
          alt="instaImage2"
        />
        <InstagramIcon fontSize="large" className="lg:hidden" />
      </div>
      <div className="">
        <div className="flex h-full min-h-[calc(100vh-150px)] space-y-3 flex-col mt-10 items-center md:items-start">
          <div
            onClick={() => router.push("/anasayfa")}
            className="flex items-center cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-500 p-2 rounded-full transition-all duration-200"
          >
            <HomeOutlinedIcon fontSize="large" />
            <h5 className="mx-4 hidden lg:block">Anasayfa</h5>
          </div>
          <SearchUsers />
          <div
            onClick={() => router.push("/explore")}
            className="flex items-center cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-500 p-2 rounded-full transition-all duration-200"
          >
            <ExploreOutlinedIcon fontSize="large" />
            <h5 className="mx-4 hidden lg:block">Keşfet</h5>
          </div>
          <UploadModal
            text="Oluştur"
            icon={<AddCircleOutlineIcon fontSize="large" />}
          />
          <div
            onClick={() => router.push(`/profil/${user.username}`)}
            className="flex ml-1 items-center cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-500 p-2  rounded-full transition-all duration-200"
          >
            <img
              className="rounded-full object-cover w-8 h-8"
              alt="Travis Howard"
              src={user?.profilePicture}
            />
            <h5 className="mx-4 hidden lg:block">Profil</h5>
          </div>
        </div>
        <div className=" ">
          <Settings />
        </div>
      </div>
    </div>
  );
}
