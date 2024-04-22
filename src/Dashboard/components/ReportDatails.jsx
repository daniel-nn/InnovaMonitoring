import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Header from "./Header";
import ReactImageGallery from "react-image-gallery";
import { useNavigate, useParams } from "react-router-dom";
import { GiPoliceBadge } from "react-icons/gi";
import { MdLocalPolice } from "react-icons/md";
import { GiCctvCamera } from "react-icons/gi";

import {
  AiFillCheckCircle,
  AiFillFilePdf,
  AiOutlineNumber,
  AiOutlineTeam,
} from "react-icons/ai";

import { Button } from "primereact/button";
import { BsBuildings, BsCalendarDate } from "react-icons/bs";
import { GoUnverified } from "react-icons/go";
import { FaLevelUpAlt, FaUser } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdEmail, MdOutlineMail } from "react-icons/md";

import { BiTimeFive } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import useFetchReportId from "../Hooks/useFetchReportId";
import { verifyReport } from "../helper/verifyReport";
import { getReportId } from "../helper/getReportId";
import { deleteItem } from "../helper/delete";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

let url = `${process.env.REACT_APP_SERVER_IP}/reports`;
let noImages = [
  {
    original:
      "https://drive.google.com/uc?export=view&id=1eMI2HyOcQ_qYiTQyszHsEiTIgQpTi_l4",
    thumbnail:
      "https://drive.google.com/uc?export=view&id=1eMI2HyOcQ_qYiTQyszHsEiTIgQpTi_l4",
  },
];

let images = [];
let videos = [];
export const ReportDatails = () => {
  const [t] = useTranslation("global");
  let dataImages = [];
  let dataVideos = [];
  const navigate = useNavigate();
  let { id } = useParams();
  const [flag, setFlag] = useState(false);
  const [reportDetails, setReportDetails] = useState({});
  //const {report, isLoading} = useFetchReportId(id, navigate);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.rol?.rolName || "";
  const { reportSaved, setreportSaved, reportFormVisible, setReportFormVisible } = useContext(UserContext);
  useEffect(() => {
    getReportId(id, navigate)
      .then((data) => setReportDetails(data))

  }, [reportSaved]);


  const deleteReport = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e6c200",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(url, reportDetails.id, navigate, flag, setFlag).then(
          console.log(
            "Se ha eliminado correctamnete el reporte " +
            reportDetails.numerCase
          )
        );
        Swal.fire("Deleted!", "Your report has been deleted.", "success");
      }
    });
  };

  const checkReport = async () => {
    let reportVerified = await verifyReport({ ...reportDetails, verified: true });
    setReportDetails(reportVerified);
    setFlag(!flag);

  };

  images = reportDetails?.evidences?.filter((img) => img.name === "Img");
  videos = reportDetails?.evidences?.filter((img) => img.name === "Vid");


  /* let link = "https://drive.google.com/uc?export=view&id=" */

  dataImages = images?.map((img) => {
    console.log(img)
    let link = img.link.split("/");
    let idImg = link[5] ? link[5] : "";
    return { original: "https://drive.google.com/uc?export=view&id=" + idImg, thumbnail: "https://drive.google.com/uc?export=view&id=" + idImg };
  });


  dataVideos = videos?.map((img) => {
    let link = img.link.split("/");
    let idVid = link[5] ? link[5] : "";
    return "https://drive.google.com/file/d/" + idVid + "/preview";
  });
  console.log(dataImages)
  return (

    <div className="mx-20 md:m-10  md:p-0 bg-white rounded-3xl">
      {/*  <Header category="Report" title="Narcotics Consumption - #3345" /> */}
      <div>
        {userRole == "Admin" ? (<div className="flex justify-end">
          <Button
            icon="pi pi-check"
            rounded
            text
            raised
            severity="primary"
            aria-label="Bookmark"
            onClick={() => {
              checkReport();
            }}
          />
          <Button
            icon="pi pi-pencil"
            rounded
            text
            raised
            severity="secondary"
            aria-label="Bookmark"
            onClick={() => { setReportFormVisible(true) }}
          />
          <Button
            icon="pi pi-times"
            rounded
            text
            raised
            severity="danger"
            aria-label="Bookmark"
            onClick={() => {
              deleteReport();
            }}
          />

          {/*  <Button
              icon="pi pi-file-export"
              rounded
              severity="success"
              aria-label="Search"
            /> */}
        </div>) : (<></>)}

        <div className="px-4 py-3 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-3">
          <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
            <div>
              <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-700 uppercase rounded-full bg-teal-accent-400">
                INNOVA MONITORING
              </p>
            </div>
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
              <span className="relative inline-block">
                <svg
                  viewBox="0 0 52 24"
                  fill="currentColor"
                  className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
                >
                  <defs>
                    <pattern
                      id="07690130-d013-42bc-83f4-90de7ac68f76"
                      x="0"
                      y="0"
                      width=".135"
                      height=".30"
                    >
                      <circle cx="1" cy="1" r=".7" />
                    </pattern>
                  </defs>
                  <rect
                    fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                    width="52"
                    height="24"
                  />
                </svg>
                <span className="relative">Incidente </span>
              </span>{" "}
              Report
            </h2>
            <p className="text-base text-gray-700 md:text-lg">

            </p>
          </div>
          <div className="grid max-w-screen-lg mx-auto space-y-2 lg:grid-cols-2 lg:space-y-0 lg:divide-x mb-24">
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full border-b-1">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsBuildings className="text-yellow-600 w-5 h-6"></BsBuildings>
                  </div>
                </div>
                <div className="flex items-center max-w-full ">
                  <h6 className=" text-xl font-bold leading-5">Property:</h6>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.property?.name}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FiUser className="text-yellow-600 w-5 h-6"></FiUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Monitoring Agent:</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.createdBy?.name}
                  </p>
                </div>
              </div>

              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiOutlineTeam className="text-yellow-600 w-5 h-6"></AiOutlineTeam>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Team:</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.company}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <HiOutlineDocumentReport className="text-yellow-600 w-5 h-6"></HiOutlineDocumentReport>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Incidente Case:</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.caseType?.incident}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaLevelUpAlt className="text-yellow-600 w-5 h-6"></FaLevelUpAlt>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Level:</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.level}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Security Guard ON Scene</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsScene ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>  <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiPoliceBadge className="text-yellow-600 w-5 h-6"></GiPoliceBadge>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Security Guard Notified</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.securityGuardsNotified ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <FaUser className="text-yellow-600 w-5 h-6"></FaUser>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Form Notification Client</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.formNotificationClient}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Observerd Via Cameras</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.observerdViaCameras ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GiCctvCamera className="text-yellow-600 w-5 h-6"></GiCctvCamera>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">List Mal Funcioning Cameras</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.listMalfuncioningCameras}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Cameras Functioning</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.camerasFunctioning ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 sm:px-4">
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BsCalendarDate className="text-yellow-600 w-5 h-6"></BsCalendarDate>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Date</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.dateOfReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Incident Start Time:</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentStartTime}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Incident End Time</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.incidentEndTime}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <BiTimeFive className="text-yellow-600 w-5 h-6"></BiTimeFive>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Time of Report</p>
                  <a className="text-lg text-teal-600 ml-3">{reportDetails?.timeOfReport}</a>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillFilePdf className="text-yellow-600 w-5 h-6"></AiFillFilePdf>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Report PDF</p>
                  <a className="text-lg ml-3 text-blue-600">Link</a>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiOutlineNumber className="text-yellow-600 w-5 h-6"></AiOutlineNumber>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Number Case</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.numerCase}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <GoUnverified className="text-yellow-600 w-5 h-6"></GoUnverified>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Verified</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.verified ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdEmail className="text-yellow-600 w-5 h-6"></MdEmail>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Emailed Report</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.emailedReport}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <MdLocalPolice className="text-yellow-600 w-5 h-6"></MdLocalPolice>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Police Notified</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeFirstResponderNotified ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Police On The Scene</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeFirstResponderScene ? (
                      <p className="text-teal-600">Yes</p>
                    ) : (
                      <p className="text-red-700">No</p>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex max-w-full ">
                <div className=" mr-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50">
                    <AiFillCheckCircle className="text-yellow-600 w-5 h-6"></AiFillCheckCircle>
                  </div>
                </div>
                <div className="flex items-center w-full border-b-1">
                  <p className=" text-lg font-bold ">Police Number Case</p>
                  <p className="text-lg text-gray-900 ml-3">
                    {reportDetails?.policeNumerCase ? (
                      <p className="text-gray-800">{reportDetails.policeNumerCase}</p>
                    ) : (
                      <p className="text-red-700">"-"</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">Video </span>
          </span>{" "}
          Gallery
        </h2>
      </div>
      <hr />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

        {
          dataVideos?.map(video => (
            <div className="flex flex-col items-center w-auto">
              <iframe
                className="block rounded-sm m-3"
                src={video}
                width="320"
                height="250"
                allow="fullscreen"
                title="1"
              ></iframe>

            </div>
          ))
        }


      </div>
      <div className="max-w-xl my-14 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <div>
          <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-gray-600 uppercase rounded-full bg-teal-accent-400">
            INNOVA MONITORING
          </p>
        </div>
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-yellow-600 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="07690130-d013-42bc-83f4-90de7ac68f76"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">Image </span>
          </span>{" "}
          Gallery
        </h2>
      </div>
      <ReactImageGallery
        showNav={false}
        showPlayButton={false}
        items={[{
          original:
            "https://i.imgur.com/29YjIqI.jpg",
          thumbnail:
            "https://i.imgur.com/29YjIqI.jpg"
        },
        {
          original:
            "https://i.imgur.com/3kBm1ZE.jpg",
          thumbnail:
            "https://i.imgur.com/3kBm1ZE.jpg"
        },
        {
          original:
            "https://i.imgur.com/XpoJulx.jpg",
          thumbnail:
            "https://i.imgur.com/XpoJulx.jpg"
        }]}
      />
    </div>

  );
};