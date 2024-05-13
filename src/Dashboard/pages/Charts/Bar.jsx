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
    <div className="m-4 md:m-10 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <ChartsHeader category="dashboard.charts.report-bar.report-bar-header" translate={t} />
      <div className="w-full flex flex-row justify-center">
        {['1', '2', '3', '4'].map((level) => (
          <Button
            key={level}
            size="small"
            style={{ marginRight: "10px" }}
            label={`${t('dashboard.charts.report-bar.level')} ${level}`}
            severity="warning"
            raised
            onClick={() => calculate(level)}
          />
        ))}
      </div>
      <div className="w-full">
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
    </div>
  );
};

export default Bar;
