import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar, } from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGrid, reportsGridAdmin, reportsGridMonitor, reportsGridNoVerified } from "../data/dummy";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle, AiOutlineFileSearch } from "react-icons/ai";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { useFetchIncidents } from "../Hooks/useFetchIncidents";
import { useTranslation } from "react-i18next";
import { getNumberOfReportsByRole } from "../helper/getNumberOfReportsByRole";
import { getReportsNoVerified } from "../helper/getReportsNoVerified";



const Reports = () => {
  const navigate = useNavigate();
  const toolbarOptions = ["Search"];
  const { propertyContext } = useContext(UserContext);
  const [reportes, setReportes] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [activeView, setActiveView] = useState('default');

  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;

  const fetchReports = useCallback(async () => {
    let reports;
    try {
      reports = await getNumberOfReportsByRole(id, user.id, userRole);
      setReportes(reports);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
    }
  }, [id, user.id, userRole]);

  const handleFetchNonVerifiedReports = useCallback(async () => {
    try {
      const nonVerifiedReports = await getReportsNoVerified();
      setReportes(nonVerifiedReports);
    } catch (error) {
      console.error('Error:', error);
    }
  }, []);

  const refreshReports = useCallback(async () => {
    if (activeView === 'noVerified') {
      await handleFetchNonVerifiedReports();
    } else {
      await fetchReports();
    }
  }, [activeView, handleFetchNonVerifiedReports, fetchReports]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const toggleView = () => {
    setActiveView(activeView === 'default' ? 'noVerified' : 'default');
  };

  const noVerifiedGridColumns = useMemo(() => reportsGridNoVerified(t, refreshReports), [t, refreshReports]);
  const adminGridColumns = useMemo(() => reportsGridAdmin(t, refreshReports), [t, refreshReports]);
  const monitorGridColumns = useMemo(() => reportsGridMonitor(t), [t]);  
  const clientGridColumns = useMemo(() => reportsGrid(t), [t]);          

  

  return (
    <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
      <Header category={t("dashboard.reports.reports-tittle")} title={t("dashboard.reports.reports-of") + propertyContext.name} />
      <div className="card flex justify-end py-2 mb-7">
        {(userRole === "Admin" || userRole === "Monitor") && (
          <>
            <Button
              onClick={() => navigate("/dashboard/NewReport")}
              label={t("dashboard.reports.buttons.add-report")}
              className="p-button-text ml-2"
            >
              <AiOutlinePlusCircle />
            </Button>
            {userRole === "Admin" && (
              <Button
                onClick={toggleView}
                label={t(activeView === 'default' ? "dashboard.reports.buttons.non-verified-reports" : "dashboard.reports.buttons.reports-per-property")}
                className="p-button-text ml-2"
              >
                <AiOutlineFileSearch />
              </Button>
            )}
          </>
        )}
      </div>
      <GridComponent
        id="gridcomp"
        key={`${activeView}-${i18n.language}`}
        dataSource={reportes}
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={contextMenuItems}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {activeView === 'noVerified'
            ? noVerifiedGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />)
            : (userRole === "Admin"
              ? adminGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />)
              : (userRole === "Monitor"
                ? monitorGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />)
                : clientGridColumns.map((item, index) => <ColumnDirective key={index} {...item} />)))
          }
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
