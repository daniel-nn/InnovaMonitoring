import React, { useEffect, useState, useContext } from "react";
import { ChartsHeader, Pie as PieChart } from "../../components";
import { useStateContext } from "../../../context/ContextProvider";
import { GetReports } from "../../helper/GetReports";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";
import { UseDataStatics } from "../../Hooks/useDataStatics";

const Pie = () => {
  const { propertyContext } = useContext(UserContext);
  const [reportes, setReportes] = useState([]);
  const { t, i18n } = useTranslation("global");

  useEffect(() => {
    const fetchData = async () => {
      const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
      const idStorage = propertyStorage.id;
      const user = JSON.parse(localStorage.getItem("user"));
      const userRole = user.role.rolName;

      const data = await GetReports(propertyContext.id || idStorage, userRole);
      const { unicosElementos, almacenadorDeVecesRepetidas, porcentajes } = UseDataStatics(data);

      const finalChartData = unicosElementos.map((element, index) => ({
        x: element,
        y: almacenadorDeVecesRepetidas[index],
        text: porcentajes[index]
      }));

      setReportes(finalChartData);
    };

    fetchData();
  }, [propertyContext, i18n.language]); // Dependencias actualizadas para reaccionar al cambio de idioma

  return (
    <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category=''  translate={t} />
      <div className="w-full">
        <PieChart
          id="chart-pie"
          data={reportes}
          legendVisibility={true}
          height="full"
        />
      </div>
    </div>
  );
};

export default Pie;
