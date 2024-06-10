import React, { useEffect, useState, useContext } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  ColumnSeries,
  DataLabel,
} from "@syncfusion/ej2-react-charts";
import { Button } from "primereact/button";
import { ChartsHeader } from "../../components";
import { useStateContext } from "../../../context/ContextProvider";
import { GetReports } from "../../helper/GetReports";
import { UserContext } from "../../../context/UserContext";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import '../css/Outlet/Outlet.css'
import { AiOutlinePlusCircle } from "react-icons/ai";

const Bar = () => {
  const { propertyContext } = useContext(UserContext);
  const { currentMode } = useStateContext();
  const [reportes, setReportes] = useState([]);
  const [reportesFormated, setReportesFormated] = useState([]);
  const [t, i18n] = useTranslation("global");

  const calculate = (level) => {
    let dataFiltered = reportes.filter(report => report.level === level);
    let levelCount = dataFiltered.length;

    //queda pentiente manejar mejor la respuesta de esta t
    setReportesFormated([{ x: `${t('dashboard.charts.report-bar.level')} ${level}`, y: levelCount, text: `${t('dashboard.charts.report-bar.reports-per-level')}: ${levelCount}` }]);
  };



  useEffect(() => {
    const fetchData = async () => {
      const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
      const user = JSON.parse(localStorage.getItem("user"));
      const idStorage = propertyStorage.id;
      const userRole = user.role.rolName;
      const data = await GetReports(propertyContext.id || idStorage, userRole);
      setReportes(data);
      calculate("1");
    };
    fetchData();
  }, [propertyContext, i18n.language]);



  return (
    <div className="mx-7 bg-white rounded-3xl overflow-auto">
      {/* <div className="background"> */}
        <ChartsHeader category="dashboard.charts.report-bar.report-bar-header" translate={t} />
        <div className="w-full flex flex-row justify-center mb-2">
          {['1', '2', '3', '4'].map((level) => (
            <button
              onClick={() => calculate(level)}
              class="button"
            >
              {`${t('dashboard.charts.report-bar.level')} ${level}`}                <AiOutlinePlusCircle />
            </button>

          ))}
        {/* </div> */}
      </div>
      <ChartComponent
        id="charts"
        key={i18n.language}
        primaryXAxis={{
          valueType: "Category",

        }}
        primaryYAxis={{
          title: t('dashboard.charts.report-bar.number-of-reports'),
        }}
        tooltip={{ enable: true }}
        background={currentMode === "Dark" ? "#33373E" : "#fff"}
        legendSettings={{ background: "white" }}
      >
        <Inject
          services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]}
        />
        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={reportesFormated}
            xName="x"
            yName="y"
            type="Column"
            marker={{
              dataLabel: {
                visible: true,
                position: "Top",
                font: { fontWeight: "600", color: "#ffffff" }
              }
            }}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </div>
  );
};

export default Bar;
