import React, { useContext, useEffect, useState } from "react";
import {GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page,Search,PdfExport, Inject, Toolbar,} from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGrid, reportsGridAdmin } from "../data/dummy";
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

const Reports = () => {
  const navigate = useNavigate();
  const { cases } = useFetchIncidents(navigate);
  const { agents } = useFetchAgents(navigate);
  const toolbarOptions = ["Search"];

  let propertiesUser = JSON.parse(localStorage.getItem("user"));
 
  let listOfPropertiesByUser = propertiesUser.properties;

  const [information, setInformation] = useState(true);

  const { propertyContext, setPropertyContext, reportSaved, setreportSaved, reportFormVisible, 
  setReportFormVisible, editReportFormVisible, setEditReportFormVisible, setReportForm,} = useContext(UserContext);

  const [reportes, setReportes] = useState([]);

  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.rol?.rolName || "";
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;
  const [t, i18n] = useTranslation("global");
  
  const [clientGridColumns, setClientGridColumns] = useState([]);
  const [adminGridColumns, setAdminGridColumns] = useState([]); // Estado para las columnas de admin
  const [activeIndex, setActiveIndex] = useState(0);

  
 
  const closeForm = () => {
    setReportFormVisible(false);
    setReportForm({}); 
    setActiveIndex(0); 
  };

  useEffect(() => {
    const updateAdminColumns = () => {
      setAdminGridColumns(reportsGridAdmin(t));
    };
    const updateClientColumns = () => {
      setClientGridColumns(reportsGrid(t)); 
    };
    GetReports(propertyContext.id || id, userRole).then((data) => {
      if (userRole == "Admin") {
        setReportes(data);
        updateAdminColumns();
      }
      if (userRole == "Client") {
        let verifiedReports = data.filter((rep) => rep.isVerified);
        setReportes(verifiedReports);
        updateClientColumns();
      }
    });

    const updateColumns = () => {
      if (userRole === "Admin") {
        setAdminGridColumns(reportsGridAdmin(t));
      } else if (userRole === "Client") {
        setClientGridColumns(reportsGrid(t));
      }
    };
    i18n.on('languageChanged', updateColumns);
    updateColumns();
    return () => {
      i18n.off('languageChanged', updateColumns);
    };
  }, [t, i18n.language, propertyContext, reportSaved]);

  const navigateToNewReport = () => {
    navigate("/dashboard/NewReport");
  };
  
  return (

    <>
      <Dialog
        header={t("dashboard.reports.new-report.add-report")}
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
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            {userRole === "Admin"
              ? adminGridColumns.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))
              : clientGridColumns.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
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
