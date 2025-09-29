import Footer from "../components/Footer";
import styles from "./HomePage.module.css";
import track from "../assets/labels/track.png";
import split from "../assets/labels/split.png";
import vault from "../assets/labels/vault.png";
import linkedin from "../assets/linkedin.png";
import github from "../assets/github.png";
import email from "../assets/email.png";
import SwipeAnimation from "../UIComponents/SwipeAnimation";
import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  const [copyStatus, setCopyStatus] = useState(false);
  const copyRef = useRef();

  function copyEmail(str) {
    navigator.clipboard.writeText(str);
    setCopyStatus(true);
  }

  useEffect(() => {
    if (copyStatus) {
      setTimeout(() => {
        setCopyStatus(false);
      }, 5000);
      setTimeout(() => {
        copyRef.current.style.opacity = 100;
      }, 0);
    }
  }, [copyStatus]);
  return (
    <>
      <Helmet>
        <title>Home | EXPENSEEASE</title>
        <meta name="description" content="Home" />
      </Helmet>
    <div className="h-full w-full pb-[200px] bg-slate-50 overflow-auto text-stone-700 rounded-l-xl rounded-r-xl lg:rounded-r-none">
        <header className="flex flex-col  sm:pt-[100px]  justify-center items-center space-y-[10px]">
          <h2 className="text-[32px] sm:text-[46px] xl:text-[52px] mx-[20px] text-center font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to{" "}
            <span style={{ fontFamily: "fredoka" }} className="uppercase">
              ExpenseEase
            </span>
          </h2>
          <p className="font-medium text-[14px] sm:text-lg text-center mx-[20px]">
            The{" "}
            <span className="text-[#9d4edd] font-medium">Expense Tracker</span>,{" "}
            <span className="text-[#9d4edd] font-medium">Digital Storage</span>,{" "}
            <span className="text-[#9d4edd] font-medium">Bill Splitter</span> -
            ALL IN ONE
          </p>
        </header>

        <div className="flex flex-grow mt-[50px] justify-center items-center">
          <SwipeAnimation />
        </div>

        <div className={`${styles.wrapper}`}>
          <div className="flex flex-col px-[40px]  sm:mx-[100px] 2xl:mx-[200px] ">
            <div className="text-center flex flex-col space-y-2 font-medium text-lg">
              <p>
                Managing finances can often be a daunting task, but with{" "}
                <span
                  style={{ fontFamily: "fredoka" }}
                  className="uppercase font-semibold"
                >
                  ExpenseEase
                </span>
                , it’s easier than ever.{" "}
                <span
                  style={{ fontFamily: "fredoka" }}
                  className="uppercase font-semibold"
                >
                  ExpenseEase
                </span>{" "}
                is designed to simplify your financial life, offering a suite of
                powerful features that help you stay organized, informed, and in
                control.
              </p>
              <p>
                Explore our three main features, each tailored to meet your
                unique financial needs:
              </p>
            </div>

            <menu className="flex flex-row 2xl:flex-row space-y-8 2xl:space-y-0 mx-auto mt-[80px] sm:mt-[80px] gap-x-8 justify-between">
              <div className="flex flex-col relative">
                <div className="rounded-3xl bg-slate-100 mt-auto w-[100px] h-[100px] aspect-square p-4 flex justify-center items-center">
                  <i className="fi fi-ss-vault flex justify-center items-center text-[50px]  text-neutral-600 "></i>
                </div>
                <div className="absolute bottom-[-10px]  left-[-30px] translate-x-[-40%] translate-y-[100%]">
                  <img src={vault} className="" alt="" />
                </div>
              </div>
              <div className="flex flex-col relative">
                <div className="rounded-3xl bg-slate-100 mt-auto w-[100px] h-[100px]  aspect-square p-4 flex justify-center items-center">
                  <i className="fi fi-ss-calculator-bill flex justify-center items-center text-[50px]  text-neutral-600"></i>
                </div>
                <div className="absolute bottom-[-10px]  left-[-30px]  translate-y-[100%]">
                  <img src={track} className="" alt="" />
                </div>
              </div>
              <div className="flex flex-col relative">
                <div className="rounded-3xl bg-slate-100 mt-auto w-[100px] h-[100px] aspect-square p-4 flex justify-center items-center">
                  <i className="fi fi-ss-hexagon-divide flex justify-center items-center  text-[50px]  text-neutral-600"></i>
                </div>
                <div className="absolute bottom-[-10px]  right-[-30px] translate-x-[40%] translate-y-[100%]">
                  <img src={split} className="" alt="" />
                </div>
              </div>
            </menu>
          </div>
        </div>

        <div className="flex flex-col mt-[200px]">
          <h1 className="font-bold capitalize underline underline-offset-4 text-[35px] text-center">
            Find me here
          </h1>

          <div className="flex justify-center  w-[80%] rounded-3xl mx-auto pt-[30px] pb-[70px] items-center mt-6 gap-28">
            <div className="text-lg relative flex justify-center items-center ">
              <img src={email} className="w-[55px] " alt="" />
              <span className="items-center absolute bottom-[-10px] translate-y-[100%] right-[50%] translate-x-[50%] min-w-[110px] justify-center bg-white rounded-xl px-2  h-fit flex w-fit py-1">
                {copyStatus ? (
                  <span className=" rounded-lg px-2">
                <span
                  style={{ fontFamily: "fredoka" }}
                  className="lowercase  text-green-400"
                >
                  Copied
                </span>
                  </span>
                ) : (
                  <button
                    onClick={() => copyEmail("sandeepnishad638672@gmail.com")}
                    className=" hover:bg-stone-100 rounded-lg px-2"
                  >
                    <span className="text-base text-nowrap font-medium ">
                      Copy Email
                    </span>
                  </button>
                )}
              </span>
            </div>
            <a
              target="_blank"
              className="hover:scale-110 duration-500"
              href="https://www.linkedin.com/in/sandeep-nishad-20792b268/"
            >
              <img src={linkedin} className="w-[50px]" alt="" />
            </a>
            <a
              className="hover:scale-110 duration-500"
              target="_blank"
              href="https://github.com/SandeepGKP"
            >
              <img src={github} className="w-[50px]" alt="" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
