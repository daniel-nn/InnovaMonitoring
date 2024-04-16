import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  Search,
  PdfExport,
  Inject,
} from "@syncfusion/ej2-react-grids";

import { contextMenuItems, ordersGrid, userGrid } from "../data/dummy";
import { Header } from "../components";
import { getUsers } from "../helper/getUsers";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFetchRoles } from "../Hooks/useFetchRoles";
import { getRoles } from "../helper/getRoles";
import { GetPropertyInfo } from "../helper/getPropertyInfo";
import { getPropertiesInfo } from "../helper/getProperties";
import { postNewUser } from "../helper/postNewUser";

export const Users = () => {
  const {
    userProvider,
    setUserProvider,
    flag
  } = useContext(UserContext);

  const [userDialog, setUserDialog] = useState(false);
  const [t, i18n] = useTranslation("global");

  const { navigate } = useNavigate();

  const toolbarOptions = ["Search"];
  const [users, setUsers] = useState([]);
  const [userSaved, setUserSaved] = useState(false);
  const [roles, setRoles] = useState([]);
  const [properties, setProperties] = useState();
  const [userGridColumns, setUserGridColumns] = useState([]);


  let propertiesSelectedVar = [];

  const [propertiesList, setPropertiesList] = useState([]);

  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUsers();
      const propertiesData = await getPropertiesInfo(navigate);
      setUsers(userData);
      setProperties(propertiesData.map(prop => ({
        id: prop.id,
        name: prop.name,
        direction: prop.direction,
        img: prop.img
      })));
    };
    fetchData();
  }, [navigate, flag]); 

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesData = await getRoles();
      if (rolesData && rolesData.length > 0) {
        const rolesArray = rolesData.map(({ id, rolName }) => ({
          rolKey: id,
          rolName: t(`dashboard.users.dialog-add-user.roles.roles-dropdown.${rolName}`)  // Traducir el nombre del rol 
        }));
        setRoles(rolesArray);
      } else {
        console.log('No roles data found');
      }
    };
    fetchRoles();
  }, [t]);  


  const header = <div className="font-bold mb-3">{t("dashboard.users.dialog-add-user.suggestion.pick-password")}</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">{t("dashboard.users.dialog-add-user.suggestion.suggestions")}</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>{t("dashboard.users.dialog-add-user.suggestion.at-least-one-lowercase")}</li>
        <li>{t("dashboard.users.dialog-add-user.suggestion.at-least-one-uppercase")}</li>
        <li>{t("dashboard.users.dialog-add-user.suggestion.at-least-one-numeric")}</li>
        <li>{t("dashboard.users.dialog-add-user.suggestion.minimum-characters")}</li>
      </ul>
    </>
  );

  const saveNewUser = async () => {
    await postNewUser(userProvider);
    setUserSaved(!userSaved);
    setUserDialog(!userDialog);
    setUserProvider({});
  };

  const handleClose = () => {
    setUserDialog(false);  // Cierra el diálogo
    setUserProvider({});   // Restablece el estado del formulario
  };

  const handleLogLanguage = () => {
    console.log("Current language:", i18n.language);
  };


  return (
    
   
    <>
      <Dialog
        header={t("dashboard.users.dialog-add-user.add-user")}
        visible={userDialog}
        style={{ width: "40vw", display: "flex", justifyContent: "center" }}
        onHide={handleClose}
        footer={
          <div className="w-full flex justify-center">
            <Button
              icon="pi pi-times"
              severity="danger"
              label={t("dashboard.users.dialog-add-user.cancel")}
              onClick={handleClose}  // Y también usa la función de cierre aquí
            />            
            <div className="w-3"></div>
            <Button
              icon="pi pi-check"
              label={t("dashboard.users.dialog-add-user.send")}
              className="w-full"
              onClick={() => {
                saveNewUser();
              }}
            />
          </div>
        }
      >
        <div className="w-full flex flex-col mx-auto">
          <div className="mt-6 mb-6 mx-auto w-7/12">
            <span className="p-float-label w-full">
              <InputText
                id="username"
                value={userProvider.name}
                className="w-full"
                onChange={(e) =>
                  setUserProvider((i) => {
                    return { ...userProvider, name: e.target.value };
                  })
                }
              />
              <label htmlFor="username">{t("dashboard.users.dialog-add-user.name")}</label>
            </span>
          </div>

          <div className=" mb-6 mx-auto w-7/12">
            <span className="p-float-label">
              <InputText
                id="username"
                value={userProvider.email}
                className="w-full"
                onChange={(e) =>
                  setUserProvider((i) => {
                    return { ...userProvider, email: e.target.value };
                  })
                }
              />
              <label htmlFor="username">{t("dashboard.users.dialog-add-user.email")}</label>
            </span>
          </div>

          <div className=" mb-6 mx-auto w-7/12 flex justify-center">
            <span className="p-float-label w-full">
              <Password
                toggleMask
                value={userProvider.password}
                onChange={(e) => setUserProvider({ ...userProvider, password: e.target.value })}
                className="w-full"
                header={header}
                footer={footer}
                promptLabel={t("dashboard.users.dialog-add-user.suggestion.enter-password")}
                weakLabel={t("dashboard.users.dialog-add-user.suggestion.password-strength.weak")}
                mediumLabel={t("dashboard.users.dialog-add-user.suggestion.password-strength.medium")}
                strongLabel={t("dashboard.users.dialog-add-user.suggestion.password-strength.strong")}
              />


              <label htmlFor="Password">{t("dashboard.users.dialog-add-user.password")}</label>
            </span>
          </div>

          <div className="mb-6 mx-auto w-7/12 flex justify-center">
            <span className="p-float-label w-full">
              <InputText
                id="image"
                value={userProvider.image}
                className="w-full"
                onChange={(e) =>
                  setUserProvider((i) => {
                    return { ...userProvider, image: e.target.value };
                  })
                }
              />
              <label htmlFor="image">{t("dashboard.users.dialog-add-user.image-url")}</label>
            </span>
          </div>

          <div className="mx-auto w-7/12 ">
            <Dropdown
              value={userProvider.rol}
              onChange={(e) => setUserProvider(prev => ({ ...prev, rol: e.value.rolKey }))}
              optionLabel="rolName"
              options={roles}
              placeholder={t("dashboard.users.dialog-add-user.roles.select-rol")}
              className="w-full"
            />

          </div>
        </div>
      </Dialog>

      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.users.users-tittle")} />
        <div className="card flex justify-end py-2">
          {userRole == "Admin" ? (
            <Button
              onClick={() => setUserDialog(true)}
              severity="info"
              label={t("dashboard.users.add-user")}
              className="p-button-rounded p-button-info ml-2"
            >
              <AiOutlinePlusCircle className="ml-2" />
            </Button>
            
          ) : (
            <></>
          )}
        </div>
    
        <GridComponent
          id="userGrid"
          key={i18n.language}
          dataSource={users}
          allowPaging
          allowSorting
          allowExcelExport
          allowPdfExport
          toolbar={["Search"]}
        >
          <ColumnsDirective>
            {userGrid(t).map((column, index) => (
              <ColumnDirective key={index} {...column} />
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
