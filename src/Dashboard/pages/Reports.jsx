import React, { useContext, useEffect, useState } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar, } from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGrid, reportsGridAdmin, reportsGridMonitor } from "../data/dummy";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import { FooterReportForm } from "../components/Forms/FooterReportForm/FooterReportForm";
import { ReportFormEvidences } from "../components/Forms/ReportFormEvidences";
import { useFetchIncidents } from "../Hooks/useFetchIncidents";
import { useFetchAgents } from "../Hooks/useFetchAgents";
import { GetReports } from "../helper/GetReports";
import { ReportFormEdit } from "../components/Forms/ReportFormEdit";
import { ReportFormEvidencesEdit } from "../components/Forms/ReportFormEvidencesEdit";
import { ReportForm } from "../components/Forms/ReportForm";
import { useTranslation } from "react-i18next";
import { getNumberOfReportsByRole } from "../helper/getNumberOfReportsByRole";
import { Column } from "@syncfusion/ej2-react-charts";

const Reports = () => {
  const navigate = useNavigate();
  const { cases } = useFetchIncidents(navigate);
  const { agents } = useFetchAgents(navigate);
  const toolbarOptions = ["Search"];

  let propertiesUser = JSON.parse(localStorage.getItem("user"));

  let listOfPropertiesByUser = propertiesUser.properties;

  const [information, setInformation] = useState(true);

  const { propertyContext, setPropertyContext, reportSaved, setreportSaved, reportFormVisible,
    setReportFormVisible, editReportFormVisible, setEditReportFormVisible, setReportForm, } = useContext(UserContext);

  const [reportes, setReportes] = useState([]);

  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.roleName;
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  const [t, i18n] = useTranslation("global");

  const [clientGridColumns, setClientGridColumns] = useState([]);
  const [adminGridColumns, setAdminGridColumns] = useState([]);
  const [monitorGridColumns, setMonitorGridColumns] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeForm = () => {
    setReportFormVisible(false);
    setReportForm({});
    setActiveIndex(0);
  };


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
        let verifiedReports = reports.filter(report => report.isVerified);
        setReportes(verifiedReports);
        setClientGridColumns(reportsGrid(t));
      }
    };
    fetchReports();
  }, [t, i18n.language, propertyContext, reportSaved, userRole, user.id, propertyContext.id || id]);

  const navigateToNewReport = () => {
    navigate("/dashboard/NewReport");
  };

  const navigateEditReport = () => {
    navigate("/dashboard/EditReport");
  };

  return (

    <>
      <Dialog
        header={t("dashboard.reports.new-reporst.add-report")}
        visible={reportFormVisible}
        style={{ width: "50vw" }}
        onHide={closeForm}
        footer={<FooterReportForm
          setInformation={setInformation}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />}
      >

        {information ? (
          <ReportForm
            incidents={cases}
            properties={listOfPropertiesByUser}
            agents={agents}
          />
        ) : (
          <ReportFormEvidences
            setReportFormVisible={setReportFormVisible}
            reportSaved={reportSaved}
            setreportSaved={setreportSaved}
          />
        )}
      </Dialog>
      
      <Dialog
        header={t("dashboard.reports.edit-report.edit-tittle")}
        visible={editReportFormVisible}
        style={{ width: "50vw" }}
        onHide={() => {
          setEditReportFormVisible(false);
          setReportForm({});
        }}
        footer={<FooterReportForm
          setInformation={setInformation}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex} // Esto es crítico para evitar el error
        />}
      >
        {information ? (
          <ReportFormEdit
            incidents={cases}
            properties={listOfPropertiesByUser}
            agents={agents}
          />
        ) : (
          <ReportFormEvidencesEdit
            setReportFormVisible={setReportFormVisible}
            reportSaved={reportSaved}
            setreportSaved={setreportSaved}
          />
        )}
      </Dialog>
      <button
        onClick={() => console.log("Reportes:", reportes)}
        className="mt-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Mostrar Reportes en Consola
      </button>
      <button
        onClick={() => console.log(localStorage)}
        className="mt-4 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Localstorage
      </button>
      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header category={t("dashboard.reports.reports-tittle")} title={t("dashboard.reports.reports-of") + propertyContext.name} />
        <div className="card flex justify-end py-2 mb-7">
          {(userRole === "Admin" || userRole === "Monitor") && (
            <>
              <Button
                onClick={() => setReportFormVisible(!reportFormVisible)}
                severity="info"
                label={t("dashboard.reports.add-report")}
                className="p-button-text"
              >
                <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
              </Button>
              <Button
                onClick={navigateToNewReport}
                severity="info"
                label={t("dashboard.reports.new-report.add-report")} 
                className="p-button-text ml-2" 
              >
                <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
              </Button>
              <Button
                onClick={navigateEditReport}
                severity="info"
                label={t("Reporte editar sin traduccion")}
                className="p-button-text ml-2"
              >
                <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
              </Button>
            </>
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
    </>
  );
};
export default Reports;
