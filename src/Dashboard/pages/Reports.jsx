import React, { useContext, useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar, } from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGrid, reportsGridAdmin, reportsGridMonitor } from "../data/dummy";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { useFetchIncidents } from "../Hooks/useFetchIncidents";
import { useTranslation } from "react-i18next";
import { getNumberOfReportsByRole } from "../helper/getNumberOfReportsByRole";

const Reports = () => {
  const navigate = useNavigate();
  const toolbarOptions = ["Search"];

  let propertiesUser = JSON.parse(localStorage.getItem("user"));


  const { propertyContext, reportSaved } = useContext(UserContext);

  const [reportes, setReportes] = useState([]);

  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  const [t, i18n] = useTranslation("global");

  const [clientGridColumns, setClientGridColumns] = useState([]);
  const [adminGridColumns, setAdminGridColumns] = useState([]);
  const [monitorGridColumns, setMonitorGridColumns] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      let reports;
      try {
        reports = await getNumberOfReportsByRole(propertyContext.id || id, user.id, userRole);
      } catch (error) {
        console.error("Error al obtener los reportes:", error);
        reports = [];
      }
      setReportes(reports);
      if (userRole === "Admin") {
        setAdminGridColumns(reportsGridAdmin(t));
      } else if (userRole === "Monitor") {
        setMonitorGridColumns(reportsGridMonitor(t));
      } else if (userRole === "Client") {
        let verifiedReports = reports.filter(report => report.verified);
        setReportes(verifiedReports);  
        setClientGridColumns(reportsGrid(t));
      }
    };
    fetchReports();
  }, [t, i18n.language, propertyContext, reportSaved, userRole, user.id, propertyContext.id || id]);

  const navigateToNewReport = () => {
    navigate("/dashboard/NewReport");
  };

  return (
    <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header category={t("dashboard.reports.reports-tittle")} title={t("dashboard.reports.reports-of") + propertyContext.name} />
        <div className="card flex justify-end py-2 mb-7">
          {(userRole === "Admin" || userRole === "Monitor") && (
          
              <Button
                onClick={navigateToNewReport}
                severity="info"
                label={t("dashboard.reports.new-report.add-report")} 
                className="p-button-text ml-2" 
              >
                <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
              </Button>
            
          )}
        </div>
        
        {/* Esta es la tabla */}
        <GridComponent
          id="gridcomp"
          key={i18n.language}
          dataSource={reportes}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          toolbar={toolbarOptions}
        >
          <ColumnsDirective>
            {(() => {
              if (userRole === "Admin") {
                return adminGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />);
              } else if (userRole === "Monitor") {
                return monitorGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />);
              } else if (userRole === "Client") {
                return clientGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />);
              }
            })()}
          </ColumnsDirective>
          <Inject
            services={[
              Resize,
              Sort,
              ContextMenu,
              Filter,
              Page,
              PdfExport,
              Search,
              Toolbar,
            ]}
          />
        </GridComponent>
      </div>
  );
};
export default Reports;
