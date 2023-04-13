import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileQuery } from "../redux/services/userService";
import { setUserData } from "@/redux/slices/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LefBar from "./LeftBar";
import MobileNavigation from "./MobileNavigation";
import UploadModal from "../components/modals/UploadModal";
import Image from "next/image";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Divider } from "@mui/material";
import Settings from "../components/Settings";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { data } = useGetProfileQuery({});
  const { user } = useSelector((store) => store.auth);
  const token = Cookies.get("token");
  const router = useRouter();

  //eğer token yoksa anasayfaya yönlendir
  useEffect(() => {
    if (!token) {
      router.replace("/");
    }
  }, [token]);

  //ilk sayfa yüklenişinde kullanıcı bilgilerini al
  useEffect(() => {
    dispatch(setUserData(data?.user));
  }, [data]);

  //responsive layout+fixed leftbar+mobil navigasyon
  return (
    <>
      {user ? (
        <div className="sm:flex dark:bg-gray-700  dark:text-white transition-all duration-300">
          <div className="hidden sm:block fixed left-0 top-0 h-screen">
            <LefBar />
          </div>
          <div className=" sm:hidden w-full p-2 flex justify-between items-center">
            <Image
              className=""
              src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
              width={120}
              height={100}
              alt="instaImage2"
            />
            <div className="flex items-center space-x-4">
              <div className="flex items-end justify-end">
                <UploadModal
                  text="Oluştur"
                  icon={<AddCircleOutlineIcon fontSize="large" />}
                />
              </div>
              <div className=" ">
                <Settings />
              </div>
            </div>
          </div>
          <Divider />
          <div className="sm:hidden fixed bottom-0 left-0 z-50">
            <MobileNavigation />
          </div>
          <main className="w-full lg:ml-64 md:ml-24 sm:ml-20 mx-auto">
            {children}
          </main>
        </div>
      ) : null}
    </>
  );
}
