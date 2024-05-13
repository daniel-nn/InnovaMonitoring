import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { GoPrimitiveDot } from "react-icons/go";
import { Stacked, Pie, SparkLine, Header } from "../components";
import imagen from "../../assets/arrest.jpg";
import { earningData,SparklineAreaData,ecomPieChartData,} from "../data/dummy";
import { useStateContext } from "../../context/ContextProvider";
import { HiDocumentReport, HiStatusOffline, HiStatusOnline,} from "react-icons/hi";
import { UserContext } from "../../context/UserContext";
import useFetchProperty from "../Hooks/useFetchProperty";
import { useNavigate } from "react-router-dom";
import { GetPropertyInfo } from "../helper/getPropertyInfo";
import { TbDeviceCctv, TbDeviceCctvOff } from "react-icons/tb";
import { GiPoliceCar } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { getNumberOfReportsByRole } from "../helper/getNumberOfReportsByRole";
import { Button } from "primereact/button";


let mag = {
  id: 2,
  name: "Bell Air",
  direction: "Fl 1231 Opa-Loka",
  img: "https://drive.google.com/uc?export=view&id=1y3mtI4oTCz9Dk_ME4bHuw9q0aW44-sur",
};

const Ecommerce = () => {
  const formatImageName = (name) => {
    return name.toLowerCase().split(' ').join('-') + '.jpg';
  };

  const { currentColor } = useStateContext(); 
  const [t] = useTranslation("global");
  const [propertyFetched, setPropertyFetched] = useState({});
  
  let user = JSON.parse(localStorage.getItem("user") || '{}'); 
  let userId = user.id;
  let userRole = user.role.rolName;
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected") || '{}') || user.properties?.[0]; 
  const { propertyContext } = useContext(UserContext);
  const [reportsData, setReportsData] = useState(null); 

  useEffect(() => {
    if (propertyContext && propertyContext.id) {
      console.log("Buscando información actualizada para la propiedad seleccionada:", propertyContext);
      GetPropertyInfo(propertyContext.id, userRole).then((data) => {
        if (data) {
          setPropertyFetched(data);
        } else {
          console.error("No se pudo obtener la información de la propiedad.");
        }
      });
    }
  }, [propertyContext, userRole]);


  const backgroundImageUrl = propertyContext.name ? `${process.env.PUBLIC_URL}/images/${formatImageName(propertyContext.name)}` : '';

  const numOfReports = reportsData ? reportsData.length : "...";
  useEffect(() => {
    if (propertyContext && propertyContext.id) {
          setReportsData([]);
      getNumberOfReportsByRole(propertyContext.id, userId, userRole)
        .then(reports => {
          setReportsData(reports || []); 
        })
        .catch(error => {
          console.error("Error al obtener los reportes: ", error);
          setReportsData(null);
        });
    }
  }, [propertyContext, userRole, userId]);

  return (
    
    <div className="m-10 md:m-8 mt-5 p-2 md:p-0 bg-white rounded-3xl">
      <Header category={t("dashboard.dashboard-index.home")} title={propertyContext.name} />
      <div className="mt-3 ">
        <div
          className="flex flex-wrap lg:flex-nowrap justify-center bg-no-repeat bg-cover bg-center py-20"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <div className="h-44 rounded-xl w-full lg:w-96 p-8 pt-9 m-3 bg-gray-800/60  bg-no-repeat bg-cover bg-center">
            <div className="flex justify-between items-center py-5">
              <div>
                <p className="p-0 font-bold text-gray-300">{t("dashboard.dashboard-index.number-reports")}</p>
                <p className="p-0 text-2xl rounded-md text-gray-300">
                  {reportsData === null ? 'Cargando...' : reportsData.length}
                </p>
              </div>
              <NavLink
                to="/dashboard/reports"
              >
              <button
                type="button"
                style={{ backgroundColor: "goldenrod" }}
                className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4 ml-3">
                  <HiDocumentReport />
              </button>
                </NavLink>
            </div>
          </div>

          <div className="flex m-3 flex-wrap gap-1 items-">
            <div key={1} className="bg-white/75 dar:text-gray-200 dark:bg-secondary-dark-bg md:w-52 p-4 pt-9 rounded-2xl">
              
              <button
            
            type="button"
                style={{
                  color: "#03C9D7",
                  backgroundColor: "#E5FAFB",
                }}
                className="text-2xl opacity-0.9 rounded-full p-4"
              >
             
                  <TbDeviceCctv />
              </button>
              
              <p className="p-0 mt-3">
                <span className="text-lg font-semibold">
                  {propertyFetched.cameras?.length || 40}
                </span>
              </p>
              <p className="p-0 text-md text-gray-700 mt-1">{t("dashboard.dashboard-index.total-cameras")}</p>
            </div>
            <div
              key={2}
              className="bg-white/75
                   dar:text-gray-200 dark:bg-secondary-dark-bg
                   md:w-52 p-4 pt-9 rounded-2xl"
            >
              <button
                type="button"
                style={{
                  color: "rgb(255, 244, 229)",
                  backgroundColor: "#8BE78B",
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <Link to={`/dashboard/`}>
                <HiStatusOnline />
                </Link>
              </button>
              <p className="p-0 mt-3">
                <span className="text-lg font-semibold">
                  {propertyFetched.numCamerasWorking || 26}
            
                </span>
              </p>
              <p className="p-0 text-md text-gray-700 mt-1">{t("dashboard.dashboard-index.cameras-on")}</p>
            </div>
            <div
              key={3}
              className="bg-white/75
                   dar:text-gray-200 dark:bg-secondary-dark-bg
                   md:w-52 p-4 pt-9 rounded-2xl"
            >
              <button
                type="button"
                style={{
                  color: "gray",
                  backgroundColor: "lightgray",
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <HiStatusOffline />
              </button>
              <p className="p-0 mt-3">
                <span className="text-lg font-semibold">
                  {propertyFetched.numCamerasOffline || 3}
                </span>
              </p>
              <p className="p-0 text-md text-gray-700 mt-1">{t("dashboard.dashboard-index.cameras-off")}</p>
            </div>

            <div key={4} className="bg-white/75 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-1/4 p-4 pt-9 rounded-2xl">
              <button
                type="button"
                style={{
                  color: "#CD0E0E",
                  backgroundColor: "#EFB9B9",
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                <TbDeviceCctvOff />
              </button>
              <p className="p-0 mt-3">
                <span className="text-lg font-semibold">
                  {propertyFetched.numCamerasVandalized || 5}
                </span>
              </p>
              <p className="p-0 text-base text-gray-700 mt-1">
                {t("dashboard.dashboard-index.vandalized-cameras")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
