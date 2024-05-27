import React, { useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar } from "@syncfusion/ej2-react-grids";
import { contextMenuItems, reportsGrid, reportsGridAdmin, reportsGridMonitor, reportsGridNoVerified } from "../data/dummy";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle, AiOutlineFileSearch } from "react-icons/ai";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNumberOfReportsByRole } from "../helper/getNumberOfReportsByRole";
import { getReportsNoVerified } from "../helper/getReportsNoVerified";
import { useStateContext } from "../../context/ContextProvider"
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Stomp from "stompjs";
import TableSkeleton from "../components/TableSkeleton";
import { Toast } from "primereact/toast";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


const Reports = () => {
  const navigate = useNavigate();
  const toolbarOptions = ["Search"];
  const { propertyContext, creatingReport, userContext } = useContext(UserContext);
  const [reportes, setReportes] = useState([]);
  const [t, i18n] = useTranslation("global");
  const [activeView, setActiveView] = useState('default');
  const [loading, setLoading] = useState(true);



  const { activeMenu } = useStateContext();
  const toast = useRef(null);

  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  let propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  let idStorage = propertyStorage.id;
  let id = propertyContext.id || idStorage;


  const fetchReports = useCallback(async () => {
    setLoading(false);
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

  useEffect(() => {
    const socket = new WebSocket("ws://52.90.149.16:8080/ws"); // URL del WebSocket del servidor Spring Boot
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log(`/topic/user/user-${user.id.toString()}`);
      stompClient.subscribe(
        `/topic/user/user-${userContext.id.toString()}`,
        (response) => {
          const newMessage = response.body;
          if (toast.current != null) {
            console.log()
            console.log(newMessage)
            toast?.current?.show({ severity: 'success', summary: 'Info', detail: JSON.parse(newMessage).type });

          }
        }
      );
    });
    return () => {
      toast.current = null;
    };
  }, []);

  const toggleView = () => {
    setActiveView(activeView === 'default' ? 'noVerified' : 'default');
  };

  const noVerifiedGridColumns = useMemo(() => reportsGridNoVerified(t, refreshReports), [t, refreshReports]);
  const adminGridColumns = useMemo(() => reportsGridAdmin(t, refreshReports), [t, refreshReports]);
  const monitorGridColumns = useMemo(() => reportsGridMonitor(t), [t]);
  const clientGridColumns = useMemo(() => reportsGrid(t), [t]);

  const gridWidth = "100%";


  return (
    <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl overflow: auto;">
      {creatingReport &&
        <div className="mx-auto">
          <h1 className="text-lg font-semibold text-blue-500">{t("dashboard.reports.report-loading")}</h1>
          <CircularProgress />
        </div>
      }
      <Toast ref={toast} />
      <Header title={
        t(
          activeView === 'default'
            ? `${t("dashboard.reports.reports-of")}${propertyContext.name}`
            : "dashboard.reports.buttons.non-verified-reports"
        )
      }
      />



      <div className="card flex justify-start py-2 mb-7">
        {(userRole === "Admin" || userRole === "Monitor") && (
          <div className='flex w-[450px] justify-between'>
            <Button
              onClick={() => navigate("/dashboard/NewReport")}
              label={t("dashboard.reports.buttons.add-report")}
            >
              <AiOutlinePlusCircle />
            </Button>
            {userRole === "Admin" && (
              <Button
                onClick={toggleView}
                label={t(activeView === 'default' ? "dashboard.reports.buttons.non-verified-reports" : "dashboard.reports.buttons.reports-per-property")}
              >
                <AiOutlineFileSearch />
              </Button>
            )}
          </div>
        )}
      </div>
      {/* {loading ? <TableSkeleton /> : ( */}

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
        allowResizing

      >
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
        <ColumnsDirective>
          {activeView === "noVerified"
            ? noVerifiedGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item} />
            ))
            : userRole === "Admin"
              ? adminGridColumns.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))
              : userRole === "Monitor"
                ? monitorGridColumns.map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))
                : clientGridColumns.map((item, index) => (
                  <ColumnDirective key={index} {...item} />
                ))}
        </ColumnsDirective>
      </GridComponent>

        {/* <DataTable value={reports} paginator rows={10} dataKey="id" filterDisplay="row" loading={loading}
          globalFilterFields={['name', 'country.name', 'representative.name', 'status']} header={header} emptyMessage="No customers found.">
            
          <Column field="name" header="Name" filter filterPlaceholder="Search by name" style={{ minWidth: '12rem' }} />
          <Column header="Country" filterField="country.name" style={{ minWidth: '12rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
          <Column header="Agent" filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '14rem' }}
            body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
          <Column field="status" header="Status" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
          <Column field="verified" header="Verified" dataType="boolean" style={{ minWidth: '6rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
        </DataTable> */}
      {/* )} */}
    </div>
  );
};
export default Reports;