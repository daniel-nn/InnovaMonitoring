import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar,} from "@syncfusion/ej2-react-grids";
import { useTranslation } from "react-i18next";
import { contextMenuItems, propertyGrid,} from "../data/dummy";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { UserContext } from "../../context/UserContext";
import { getPropertiesMapped } from "../helper/getPropertiesMapped";
import { postNewProperty } from "../helper/postNewProperty";
import Swal from 'sweetalert2';


export const Properties = () => {
  const toolbarOptions = ["Search"];
  const { navigate } = useNavigate();
  const [t, i18n] = useTranslation("global");
  const [error, setError] = useState(null);


  const [properties, setProperties] = useState([]);
  const [propertySaved, setPropertySaved] = useState(false);
  const [visible, setVisible] = useState(false);
  let propertiesUser = JSON.parse(localStorage.getItem("user"));
  let listOfPropertiesByUser = propertiesUser.properties;
  const {
    propertyProvider, setPropertyProvider, agentDialog,
    setAgentDialog,
    flag,
    setFlag,
  } = useContext(UserContext);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  const [validationErrors, setValidationErrors] = useState({});


  useEffect(() => {
    getPropertiesMapped(navigate).then(data => {
      console.log("Received data:", data);
      if (!data || data.some(property => property == null)) {
        throw new Error("Invalid or incomplete data returned");
      }
      setProperties(data);
      setError(null);
    }).catch(error => {
      console.error("Failed to fetch properties, setting empty array:", error);
      setError("Failed to load properties");
      setProperties([]); // Se asegura un arreglo vacío en caso de error
    });
  }, [agentDialog, flag, navigate]);

  const saveNewProperty = async () => {
    await postNewProperty(propertyProvider, t);
    setAgentDialog(!agentDialog);
    setPropertySaved(!propertySaved);
    setPropertyProvider({});
  };


  const validatePropertyDetails = () => {
    const errors = {};
    const { name, direction, img, mapImg } = propertyProvider;
    if (!name) errors.name = t("dashboard.properties.dialog.swal.validate-property-details.name");
    if (!direction) errors.direction = t("dashboard.properties.dialog.swal.validate-property-details.direction");
    if (!img) errors.img = t("dashboard.properties.dialog.swal.validate-property-details.img-url");
    if (!mapImg) errors.mapImg = t("dashboard.properties.dialog.swal.validate-property-details.map-url");

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setPropertyProvider((prevState) => ({
      ...prevState,
      [field]: value
    }));

    if (validationErrors[field] && value.trim()) {
      setValidationErrors((prevState) => ({
        ...prevState,
        [field]: null
      }));
    }
  };

  const handleSaveProperty = () => {
    if (validatePropertyDetails()) {
      saveNewProperty();
    }
  };

 

  const handleClose = () => {
    setAgentDialog(false);  
    setPropertyProvider({}); 
      setValidationErrors({})
  };

  return (
    <>
      <Dialog
        header={t("dashboard.properties.dialog.dialog-title")}
        onHide={handleClose} 
        visible={agentDialog}
        modal={true}          
        dismissableMask={true}
        style={{ width: "30vw", display: "flex", justifyContent: "center" }}
        footer={
          <div className="w-full flex justify-end">
            <Button
              icon="pi pi-times"
              severity="danger"
              label={t("dashboard.properties.dialog.cancel")}
              onClick={handleClose}  
            />            
            <div className="w-3"></div>
            <Button
              icon="pi pi-check"
              label={t("dashboard.properties.dialog.send")}
              onClick={() => {
                handleSaveProperty();
              }}
            />
          </div>
        }
      >

        <div className="w-full flex flex-col mx-auto">
          <div className="mb-6 mx-auto">
            <span className="p-float-label">
              <InputText
                id="name"
                value={propertyProvider.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <label htmlFor="name">{t("dashboard.properties.dialog.property-name")}</label>
            </span>
            {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
          </div>

          <div className="mb-6 mx-auto">
            <span className="p-float-label">
              <InputText
                id="direction"
                value={propertyProvider.direction}
                onChange={(e) => handleInputChange('direction', e.target.value)}
              />
              <label htmlFor="direction">{t("dashboard.properties.dialog.address")}</label>
            </span>
            {validationErrors.direction && <small className="p-error">{validationErrors.direction}</small>}
          </div>

          <div className="mb-6 mx-auto">
            <span className="p-float-label">
              <InputText
                id="img"
                value={propertyProvider.img}
                onChange={(e) => handleInputChange('img', e.target.value)}
              />
              <label htmlFor="img">{t("dashboard.properties.dialog.img-url")}</label>
            </span>
            {validationErrors.img && <small className="p-error">{validationErrors.img}</small>}
          </div>

          <div className="mb-6 mx-auto">
            <span className="p-float-label">
              <InputText
                id="mapImg"
                value={propertyProvider.mapImg}
                onChange={(e) => handleInputChange('mapImg', e.target.value)}
              />
              <label htmlFor="mapImg">{t("dashboard.properties.dialog.property-map")}</label>
            </span>
            {validationErrors.mapImg && <small className="p-error">{validationErrors.mapImg}</small>}
          </div>
        </div>

      </Dialog>

      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.properties.properties-title")} />

        <div className="card flex justify-end py-2">
          {userRole == "Admin" ? (
            <Button
              severity="info"
              label={t("dashboard.properties.add-property")}
              className="p-button-text ml-2"
              onClick={() => {
                setAgentDialog(!agentDialog);
              }}
            >
              <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
            </Button>
          ) : (
            <></>
          )}
        </div>

        {properties && properties.length > 0 ? (
          <GridComponent
            id="gridcomp"
            key={i18n.language}
            dataSource={properties}
            allowPaging
            allowSorting
            allowExcelExport
            allowPdfExport
            contextMenuItems={contextMenuItems}
            toolbar={toolbarOptions}
            style={{ position: "absolute", zIndex: 0 }}
          >
            <ColumnsDirective>
              {propertyGrid(t).map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[Resize, Sort, ContextMenu, Filter, Page, PdfExport, Toolbar, Search]}
            />
          </GridComponent>
        ) : (
          <div>Loading properties...</div>  
        )}
        
      </div>
    </>
  );
};
