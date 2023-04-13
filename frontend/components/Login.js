import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useLoginMutation } from "../redux/services/userService";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { setUserData } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState("password");
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "E-Mail alanını doldurunuz.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Geçersiz Email Adresi";
    }

    if (!values.password) {
      errors.password = "Şifre Alanını doldurunuz.";
    } else if (values.password.length < 8) {
      errors.password = "Şifre 8 karakterden büyük olmalıdır";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      checkbox: false,
    },
    validate,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await login(values)
          .unwrap()
          .then((response) => {
            if (response.isSuccess) {
              toast.success("Giriş Başarılı!");
              Cookies.set("token", response.value.token);
              let user = response.value.user;
              dispatch(setUserData(user));
            }
          })
          .finally(() => setLoading(false));
      } catch (error) {
        console.log(error);
        toast.error(error.data.message);
      }
    },
  });

  return (
    <div className="mb-10">
      <div className="border flex flex-col items-center bg-white p-8 h-[400px]  w-[330px] mb-2">
        <Image
          src="https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png"
          width={200}
          height={100}
          alt="instaImage2"
        />
        <form onSubmit={formik.handleSubmit} className="mt-2 w-full ">
          <label className="block relative">
            <input
              id="email"
              name="email"
              required
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
              type="text"
              className="w-full rounded-sm valid:pt-[10px] peer border-gray-200 border p-2 bg-gray-100 outline-none px-2 placeholder:text-xs"
            />
            <small className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2">
              E-Posta
            </small>
          </label>
          <label className="block relative mt-4 ">
            <input
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
              type={show}
              required
              className="w-full rounded-sm pr-12 valid:pt-[10px] peer border-gray-200 border p-2 bg-gray-100 outline-none px-2 placeholder:text-xs"
            />
            <small className="absolute top-1/2 left-[9px] cursor-text pointer-events-none text-xs text-gray-400 -translate-y-1/2 transition-all peer-valid:text-[10px] peer-valid:top-2">
              Şifre
            </small>
            <small
              onClick={() => setShow(show === "password" ? "text" : "password")}
              className="absolute cursor-pointer right-2 translate-y-1/2 text-sm font-semibold text-gray-500"
            >
              {formik.values.password
                ? show == "password"
                  ? "Göster"
                  : "Gizle"
                : null}
            </small>
          </label>
          <div className="flex items-center mt-2">
            <input
              id="checkbox"
              checkbox="checkbox"
              type="checkbox"
              onChange={formik.handleChange}
              value={formik.values.checkbox}
            />
            <span className="text-xs p-2 bottom-2">
              Giriş bilgilerini kaydet
            </span>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="h-[30px] bg-blue-400 rounded-md text-sm font-semibold text-white w-full mt-3"
          >
            {loading ? "Yükleniyor" : "Giriş Yap"}
          </button>
        </form>
        <div className="w-full flex items-center my-2.5 mb-3.5">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="px-4 text-[13px] text-gray-500 font-semibold">
            Ya da
          </span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>
        <span className="text-sm text-gray-500  cursor-pointer">
          Şifreni mi Unuttun?
        </span>
        <div className="text-xs font-semibold text-red-500 flex flex-col mt-2 items-start justify-start p-0 w-full">
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>
      </div>
      <div className="border flex items-center bg-white p-6 justify-center text-sm h-[60px]">
        Hesabın Yok mu?{" "}
        <Link href="/register">
          <span className="text-blue-400 font-bold cursor-pointer">
            &nbsp;Kaydol
          </span>
        </Link>
      </div>
    </div>
  );
}
