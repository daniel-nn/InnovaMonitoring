import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject,} from "@syncfusion/ej2-react-grids";
import { useTranslation } from "react-i18next";


import { contextMenuItems, ordersCases, ordersCasesAdmin, ordersGrid } from "../data/dummy";
import { Header } from "../components";
import { getIncidents } from "../helper/getIncidents";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { InputText } from "primereact/inputtext";
import { PostIncident, postIncident } from "../helper/postIncident";
import { putIncident } from "../helper/putIncident";

export const Cases = () => {
  const toolbarOptions = ["Search"];
  const { navigate } = useNavigate();
  const [cases, setCases] = useState([]);
  const [t, i18n] = useTranslation("global");


  const {
    caseProvider,
    setCaseProvider,
    caseDialog,
    setCaseDialog,
    editCase,
    setEditCase,
    reportSaved, 
    setreportSaved
  } = useContext(UserContext);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;


  useEffect(() => {
    getIncidents(navigate).then((data) => setCases(data));
  }, [reportSaved]);

  const editIncident = async() => {
    await putIncident(caseProvider, setreportSaved, reportSaved);
    setCaseDialog(!caseDialog);
    setCaseProvider({})
  };


  const saveIncident = async () => {
    await postIncident(caseProvider, setreportSaved, reportSaved)
    setCaseDialog(!caseDialog);
  };

  const handleClose = () => {
    setCaseDialog(false);     // Cierra el diálogo
    setCaseProvider({});      // Limpia el estado del proveedor de casos
    setEditCase(false);       // Restablece cualquier estado de edición
  };


  return (
    <>
      <Dialog
        header={t("dashboard.cases.add-dialog.add-title")}
        visible={caseDialog}
        style={{ width: "30vw", display: "flex", justifyContent: "center" }}
        onHide={() => {
          setCaseDialog(!caseDialog);
          setCaseProvider({});
          setEditCase(false);
        }}
        modal={true}              
        dismissableMask={true} 
        footer={
          <div className="w-full flex justify-end">
            <Button
              icon="pi pi-times"
              severity="danger"
              label={t("Cancel")}
              onClick={handleClose}     
            />
            <div className="w-3"></div>
            {editCase ? (
              <Button icon="pi pi-check" label="Save" onClick={editIncident} />
            ) : (
              <Button icon="pi pi-check" label="Send" onClick={saveIncident} />
            )}
          </div>
        }
      >
        <div className="w-full flex flex-col mx-auto">
          <div className="mt-6 mb-6 mx-auto">
            <span className="p-float-label">
              <InputText onChange={(e) => setCaseProvider((i) => {
              return { ...caseProvider, incident:e.target.value };
            })} value={caseProvider.incident} id="caseType" />
              <label htmlFor="caseType">{t("dashboard.cases.add-case")}</label>
            </span>
          </div>
        </div>
      </Dialog>
      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.cases.add-case")} />
        <div className="card flex justify-end py-2">

        {userRole == "Admin" ? (
                 
                <Button
                severity="info"
                label={t("dashboard.cases.add-case")}
                className="p-button-text ml-2"

                 onClick={() => {
                   setCaseDialog(!caseDialog);
                 }}
               >
                 {" "}
                 <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
               </Button>
                 ) : (
                   <></>
                 )}
        
        </div>

        <GridComponent
          id="gridcomp"
          dataSource={cases}
          key={i18n.language}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          contextMenuItems={contextMenuItems}
          toolbar={toolbarOptions}
          style={{ position: "absolute", zIndex: 0 }}
        >
          <ColumnsDirective>
            {ordersCasesAdmin(t).map((item, index) => (
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
            ]}
          />
        </GridComponent>

      </div>
    </>
  );
};
