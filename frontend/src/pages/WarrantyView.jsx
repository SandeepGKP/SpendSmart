import { useLoaderData } from "react-router-dom";
import FileView from "../components/vaultViewComponents/FileView";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import load from "../assets/loader.gif";
import { useDispatch } from "react-redux";
import NiceButton from "../UIComponents/NiceButton";
import RedButton from "../UIComponents/RedButton";
import Receipt from "../components/vaultViewComponents/Receipt";
import warIcon from "../assets/war.png";
import OnlyXChars from "../UIComponents/OnlyXChars";
import exclamation from "../assets/exclamation.png";
import deleted from "../assets/delete.png";
import RedirectingWindow from "../UIComponents/RedirectingWindow";
import TagView from "../components/vaultViewComponents/TagView";
import Warranty from "../components/vaultViewComponents/Warranty";
import Renew from "../components/vaultViewComponents/Renew";
import { Helmet } from "react-helmet-async";

export default function WarrantyView() {
  const data = useLoaderData();
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false);

  function deleteHandle() {
    setModalOpen(1);
    setDeleting(false);
    setError(null);
  }

  async function deleteConfirmed() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(
        import.meta.env.VITE_BACKEND_API + "/vault/deletewarranty",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            warId: data.warId,
          }),
          credentials: "include",
        }
      );
      setDeleting(false);
      if (!res.ok) {
        throw "failed";
      } else {
        setModalOpen(2);
      }
    } catch (err) {
      setDeleting(false);
      setError("Something went wrong");
      console.log(err);
    }
  }

  function closeHandle() {
    setModalOpen(false);
  }

  return (
    <>
      <Helmet>
        <title> {data.details.warName} | Warranty | BILLBUD</title>
        <meta name="description" content="Friends" />
      </Helmet>
      {modalOpen ? (
        <>
          <div className="fixed top-0 right-0 left-0 bottom-0 bg-black/40 z-10"></div>
          <div className="rounded-2xl fixed top-[50%] translate-y-[-50%] right-[50%] z-10 translate-x-[50%] translate scale-[70%] md:scale-[80%] xl:scale-100">
            {modalOpen === 1 ? (
              <div className="rounded-xl sm:w-[500px] bg-stone-100">
                <h1 className="p-8  text-center text-lg sm:text-xl font-medium">
                  Are you sure you want to delete the following Warranty?
                </h1>
                <div className="flex  justify-center mb-[10px] mt-2 sm:mb-0 sm:space-x-[120px] px-[50px]">
                  <div className="flex scale-75 origin-top shadow-lg duration-500 flex-col rounded-xl bg-slate-100 ">
                    <div className="p-4  flex space-x-4 ">
                      <div className="p-3 flex justify-center items-center w-[170px] h-[170px] rounded-2xl bg-slate-200">
                        <img
                          src={warIcon}
                          className="w-[130px] h-[130px] flex justify-center items-center"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col w-[150px] justify-center space-y-2">
                        <div className="flex flex-col">
                          <span className="font-semibold">Warranty Name</span>{" "}
                          <span className="pl-1">
                            <OnlyXChars x={15} text={data.details.warName} />
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold">Created On</span>{" "}
                          <span className="pl-1">
                            <OnlyXChars x={15} text={data.details.createdOn} />
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-semibold text-nowrap">
                            Warranty Date
                          </span>{" "}
                          <span className="pl-1">
                            <OnlyXChars x={15} text={data.details.warDate} />
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col p-4 pt-0 space-y-2">
                      <div className="flex space-x-4 ">
                        <span className="font-semibold">Description</span>{" "}
                        <span className="pl-1">
                          <OnlyXChars x={20} text={data.details.warDesc} />
                        </span>
                      </div>
                      <div className="flex space-x-8 ">
                        <div className="flex flex-col ">
                          <span className="font-semibold">Expiry Date</span>{" "}
                          <span className="">
                            <OnlyXChars
                              x={20}
                              text={data.details.expiry.date}
                            />
                          </span>
                        </div>
                        <div className="flex flex-col ">
                          <span className="font-semibold">
                            Time Till Expiry
                          </span>{" "}
                          <span
                            style={{
                              color:
                                data.details.expiry.till === null ? "red" : "",
                            }}
                            className=""
                          >
                            {data.details.expiry.till === null
                              ? "Expired"
                              : `${data.details.expiry.till.years} Y - ${data.details.expiry.till.months} M - ${data.details.expiry.till.days} D`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <form
                  method="dialog"
                  className="flex pb-4 sm:pr-4 justify-center sm:justify-end space-x-6"
                >
                  {deleting ? (
                    <div className="flex items-center">
                      <img
                        src={load}
                        className="w-[25px] h-[25px] flex justify-center items-center"
                        alt=""
                      />
                    </div>
                  ) : null}
                  {error ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={exclamation}
                        className="w-[20px] h-[20px] flex justify-center items-center"
                        alt=""
                      />{" "}
                      <span className="text-red-500 tetx-lg ">{error}</span>
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={closeHandle}
                    className="p-2 px-4 rounded-lg bg-blue-500 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    className="p-2 px-4 rounded-lg bg-red-500 text-white"
                    type="button"
                    onClick={deleteConfirmed}
                  >
                    Confirm
                  </button>
                </form>
              </div>
            ) : modalOpen === 2 ? (
              <div className="rounded-xl sm:w-[500px] bg-stone-100">
                <h1 className="p-8  text-center text-lg sm:text-xl font-medium">
                  Successfully deleted the Warranty!!
                </h1>
                <div className="flex justify-center mt-6 ">
                  <img
                    src={deleted}
                    className="w-[100px] h-[100px] flex justify-center items-center"
                    alt=""
                  />
                </div>
                <div className="mt-8 pb-12 flex justify-center">
                  <RedirectingWindow add={"/vault/protected/view/warranty"}>
                    <span>Redirecting to VAULT in </span>
                  </RedirectingWindow>
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      <div className="h-full w-full billViewBg overflow-auto pb-[200px] text-stone-700 rounded-l-xl">
        <div className="flex-col space-y-8">
          <div className=" flex-col items-center xl:items-stretch space-y-20 xl:space-y-0  xl:flex-row justify-center xl:space-x-[50px] mt-[50px] px-2 p-4 text-stone-600 flex">
            <Warranty data={data} />
            <FileView data={data} />
          </div>
          <TagView data={data.tags} />
        </div>
        <div className="mx-[10px] px-16 sm:mx-[50px] flex flex-col sm:flex-row justify-between items-center mt-[100px]">
          <Link to={"/vault/protected/view/warranty"}>
            <NiceButton text={"Go Back"} />
          </Link>
          <Renew earlyExpDate={data.details.expiry.date} warId={data.warId} />
          <button onClick={deleteHandle}>
            <RedButton text={"Delete"} />
          </button>
        </div>
      </div>
    </>
  );
}
