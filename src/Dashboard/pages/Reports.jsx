import React, { useContext, useEffect, useState, useMemo } from "react";
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

  let propertiesUser = JSON.parse(localStorage.getItem("user"));


  const { propertyContext, reportSaved } = useContext(UserContext);

  const [reportes, setReportes] = useState([]);

  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  const [t, i18n] = useTranslation("global");

  const [activeView, setActiveView] = useState('default');
  const adminGridColumns = useMemo(() => reportsGridAdmin(t), [t]);
  const monitorGridColumns = useMemo(() => reportsGridMonitor(t), [t]);
  const clientGridColumns = useMemo(() => reportsGrid(t), [t]);
  const noVerifiedGridColumns = useMemo(() => reportsGridNoVerified(t), [t]);
  const [headerTitle, setHeaderTitle] = useState(t("dashboard.reports.reports-of") + propertyContext.name);

  const [buttonState, setButtonState] = useState({
    label: "dashboard.reports.non-verified.fetch",
    view: "default"
  });


  const fetchReports = async () => {
    let reports;
    try {
      reports = await getNumberOfReportsByRole(propertyContext.id || id, user.id, userRole);
    } catch (error) {
      console.error("Error al obtener los reportes:", error);
      reports = [];
    }
    setReportes(reports);
    if (userRole === "Client") {
      let verifiedReports = reports.filter(report => report.verified);
      setReportes(verifiedReports);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [propertyContext, reportSaved, userRole, user.id, propertyContext.id || id]);

  const handleFetchNonVerifiedReports = async () => {
    try {
      const nonVerifiedReports = await getReportsNoVerified();
      console.log('Non-verified reports:', nonVerifiedReports);
      setReportes(nonVerifiedReports);
      setActiveView('noVerified');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (activeView === 'noVerified') {
      handleFetchNonVerifiedReports();
    }
  }, [t, activeView]);

  const toggleView = async () => {
    if (activeView === "default") {
      try {
        await handleFetchNonVerifiedReports();
        setActiveView('noVerified');
        setButtonState({
          label: "dashboard.reports.per-property",
          view: "noVerified"
        });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      await fetchReports();
      setActiveView('default');
      setButtonState({
        label: "dashboard.reports.non-verified.fetch",
        view: "default"
      });
    }
  };

  useEffect(() => {
    if (activeView === 'noVerified') {
      setButtonState({
        label: "dashboard.reports.per-property",
        view: "noVerified"
      });
    } else {
      setButtonState({
        label: "dashboard.reports.non-verified.fetch",
        view: "default"
      });
    }
  }, [t, activeView, i18n.language]);

  useEffect(() => {
    if (activeView === 'noVerified') {
      setHeaderTitle(t("dashboard.reports.non-verified.title")); // Suponiendo que tienes una traducción para esto
    } else {
      setHeaderTitle(t("dashboard.reports.reports-of") + propertyContext.name);
    }
  }, [t, activeView, propertyContext.name, i18n.language]);

  const navigateToNewReport = () => {
    navigate("/dashboard/NewReport");
  };

  return (
    <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
      <Header category={t("dashboard.reports.reports-tittle")} title={headerTitle} />
        <div className="card flex justify-end py-2 mb-7">
        {(userRole === "Admin" || userRole === "Monitor") && (
          <>
            <Button
              onClick={navigateToNewReport}
              severity="info"
              label={t("dashboard.reports.new-report.add-report")}
              className="p-button-text ml-2"
            >
              <AiOutlinePlusCircle className="ml-2" />
            </Button>
            {userRole === "Admin" && (
              <Button
                onClick={toggleView}
                severity="info"
                label={t(buttonState.label)}
                className="p-button-text ml-2"
              >
                <AiOutlineFileSearch className="ml-2" />
              </Button>

            )}
          </>
        )}
        </div>
        
        {/* Esta es la tabla */}
      <GridComponent
      
        id="gridcomp"
        key={`${activeView}-${i18n.language}`}  // Cambiar key basado en la vista activa
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
