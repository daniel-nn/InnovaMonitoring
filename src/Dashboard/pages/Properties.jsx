import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, PdfExport, Inject, Toolbar, } from "@syncfusion/ej2-react-grids";
import { useTranslation } from "react-i18next";
import { contextMenuItems, propertyGrid, propertyGridAdmin } from "../data/dummy";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { UserContext } from "../../context/UserContext";
import { getPropertiesMapped } from "../helper/getPropertiesMapped";
import { postNewProperty } from "../helper/Properties/postNewProperty";
import Swal from 'sweetalert2';
import { NewPropertyForm } from "../components/Forms/Properties/NewPropertyForm";
import { EditPropertyForm } from "../components/Forms/Properties/EditPropertyForm";



export const Properties = () => {
  // Hook de navegación
  const { navigate } = useNavigate();

 //barra de buscar
  const toolbarOptions = ["Search"];

  
  // Traducciones
  const [t, i18n] = useTranslation("global");

  // Estados

  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [propertySaved, setPropertySaved] = useState(false);
  const [newPropertyDialog, setNewPropertyDialog] = useState(false);
  const [editPropertyDialog, setEditPropertyDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  

  // Contexto
  const {
    propertyProvider, setPropertyProvider, agentDialog,
    setAgentDialog, flag, setFlag,
  } = useContext(UserContext);

  // Información del usuario
  let propertiesUser = JSON.parse(localStorage.getItem("user"));
  let listOfPropertiesByUser = propertiesUser.properties;
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;

  // Efecto para cargar propiedades
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getPropertiesMapped(navigate);
        if (data && data.length > 0) {
          setProperties(data);
        } else {
          console.error("No properties found");
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };

    fetchProperties();
  }, [navigate, flag]);


  // Handlers para diálogos
  const handleCloseNewPropertyDialog = () => {
    setNewPropertyDialog(false);
    setPropertyProvider({});
  };

  const handleOpenEditPropertyDialog = (property) => {
    setSelectedProperty(property);
    setEditPropertyDialog(true);
  };

  const handleCloseEditPropertyDialog = (updatedProperty) => {
    setEditPropertyDialog(false);
    if (updatedProperty) {
      setProperties(prevProperties => prevProperties.map(property =>
        property.id === updatedProperty.id ? updatedProperty : property
      ));
    }
  };
  
  const refreshProperties = async () => {
    try {
      const newData = await getPropertiesMapped();
      if (newData && newData.length > 0) {
        console.log('New data after refresh:', newData);
        setProperties(newData);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.error('Error refreshing properties:', error);
      setProperties([]);  
    }
  };


  return (
    <>
      <Dialog
        header={t("dashboard.properties.dialog.dialog-title")}
        visible={newPropertyDialog}
        style={{ width: "50vw" }}
        modal
        dismissableMask
        onHide={handleCloseNewPropertyDialog}
      >
        <NewPropertyForm onClose={handleCloseNewPropertyDialog} />
      </Dialog>

      <Dialog
        header={t("dashboard.properties.dialog.edit-property")}
        visible={editPropertyDialog}
        style={{ width: "50vw" }}
        modal
        dismissableMask
        onHide={handleCloseEditPropertyDialog}
      >
        <EditPropertyForm property={selectedProperty} onClose={handleCloseEditPropertyDialog} refreshProperties={refreshProperties} />
      </Dialog>

      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.properties.properties-title")} />

        <div className="card flex justify-end py-2">
          {userRole == "Admin" ? (
            <Button
              severity="info"
              label={t("dashboard.properties.add-property")}
              className="p-button-text ml-2"
              onClick={() => setNewPropertyDialog(true)}
            >
              <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
            </Button>
          ) : (
            <></>
          )}
        </div>

        {properties && properties.length > 0 && (
          <GridComponent
            id="gridcomp"
            key={`${i18n.language}-${JSON.stringify(properties)}`}
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
              {propertyGridAdmin(t, handleOpenEditPropertyDialog).map((item, index)  => (
                  <ColumnDirective key={index} {...item} />
            
              ))}
            </ColumnsDirective>

            <Inject services={[Resize, Sort, ContextMenu, Filter, Page, PdfExport, Toolbar, Search]} />
          </GridComponent>
        )}

      </div>
    </>
  ); 
};
