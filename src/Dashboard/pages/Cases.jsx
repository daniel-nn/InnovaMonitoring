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
      const [validationErrors, setValidationErrors] = useState({});


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


      
      const validateCaseDetails = () => {
        const errors = {};
        if (!caseProvider.incident || caseProvider.incident.trim() === "") {
          errors.incident = "Case incident is required.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
      };


      const editIncident = async () => {
        if (validateCaseDetails()) {
          await putIncident(caseProvider, setreportSaved, reportSaved, t);
          setCaseDialog(!caseDialog); 
          setCaseProvider({}); 
        }
      };


      const saveIncident = async () => {
        if (validateCaseDetails()) { 
          await postIncident(caseProvider, setreportSaved, reportSaved, t);
          setCaseDialog(!caseDialog); 
        }
      };
      const handleInputChange = (field, value) => {
        setCaseProvider((prevState) => ({
          ...prevState,
          [field]: value
        }));

        // Si hay un error asociado con este campo y el nuevo valor no está vacío, limpia el error.
        if (validationErrors[field] && value.trim()) {
          setValidationErrors((prevState) => {
            const updatedErrors = { ...prevState };
            delete updatedErrors[field];
            return updatedErrors;
          });
        }
      };

      
      const handleClose = () => {
        setCaseDialog(false);    
        setCaseProvider({});
        setEditCase(false);    
        setValidationErrors({}) 
      };


      return (
        <>
          <Dialog
            header={editCase ? t("dashboard.cases.edit-dialog.edit-tittle") : t("dashboard.cases.add-dialog.add-title")}
            visible={caseDialog}
            style={{ width: "30vw", display: "flex", justifyContent: "center" }}
            onHide={() => {
              setCaseDialog(!caseDialog);
              setCaseProvider({});
              setEditCase(false);
              setValidationErrors({});
            }}
            modal={true}              
            dismissableMask={true} 
            footer={
              <div className="w-full flex justify-end">
                <Button
                  icon="pi pi-times"
                  severity="danger"
                  label={t(editCase ? "dashboard.cases.edit-dialog.cancel" : "dashboard.cases.add-dialog.cancel")}
                  onClick={handleClose}     
                />
                <div className="w-3"></div>
                {editCase ? (
                  <Button icon="pi pi-check" label={t("dashboard.cases.edit-dialog.send")}  onClick={editIncident} />
                ) : (
                    <Button icon="pi pi-check" label={t("dashboard.cases.add-dialog.send")} onClick={saveIncident} />
                )}
              </div>
        }
      >
            <div className="w-full flex flex-col mx-auto">
              <div className="mt-6 mb-6 mx-auto">
                <span className="p-float-label">
                  <InputText
                    id="incident"
                    value={caseProvider.incident}
                    onChange={(e) => {
                      setCaseProvider(prev => ({ ...prev, incident: e.target.value }));
                      if (validationErrors.incident && e.target.value.trim()) {
                        setValidationErrors(prev => {
                          const updatedErrors = { ...prev };
                          delete updatedErrors.incident;
                          return updatedErrors;
                        });
                      }
                    }}
                  />
                  <label htmlFor="caseType">
                    {t(editCase ? "dashboard.cases.edit-dialog.name-case-label" : "dashboard.cases.add-dialog.name-case-label")}
                  </label>
                </span>
                {validationErrors.incident && <small className="p-error">{validationErrors.incident}</small>}
              </div>
            </div>

      </Dialog>
      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.cases.add-case")} />
        <div className="card flex justify-start py-2">

        {userRole == "Admin" ? (
                 
                <Button
                severity="info"
                label={t("dashboard.cases.add-case")}
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
          allowResizing={true}
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
