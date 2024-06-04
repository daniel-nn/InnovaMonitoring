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
import Swal from 'sweetalert2';
import '../pages/css/Outlet/Outlet.css'
import './css/users/Users.css';
import TableSkeleton from "../components/TableSkeleton";


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
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(false)
    getUsers().then((data) => setUsers(data));
    getPropertiesInfo(navigate).then((data) => {
      propertiesSelectedVar = data.map((i) => {
        return { id: i.id, name: i.name, direction: i.direction, img: i.img };
      });
      setProperties(propertiesSelectedVar);
    });
  }, [userSaved, flag]);

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
          rolName: t(`dashboard.users.dialog-add-user.roles.roles-dropdown.${rolName}`),
          originalName: rolName
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

  const handleInputChange = (field, value) => {
    setUserProvider((prevState) => ({
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

  const validateUserDetails = () => {
    const errors = {};
    if (!userProvider.name || userProvider.name.trim() === "") {
      errors.name = t("dashboard.users.dialog-add-user.validation.name-required");
    }
    if (!userProvider.email || userProvider.email.trim() === "") {
      errors.email = t("dashboard.users.dialog-add-user.validation.email-required");
    }
    if (!userProvider.pasword || userProvider.pasword.trim() === "") {
      errors.pasword = t("dashboard.users.dialog-add-user.validation.password-required");
    }
    if (!userProvider.rol) {
      errors.rol = t("dashboard.users.dialog-add-user.validation.role-required");
    }

    if (!userProvider.image || userProvider.image.size === 0) {
      errors.image = t("dashboard.users.dialog-add-user.validation.image-required");
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    setUserDialog(false);
    setUserProvider({});
    setValidationErrors({});
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUserProvider(prevState => ({
        ...prevState,
        image: file
      }));

      if (validationErrors.image) {
        setValidationErrors(prevState => ({
          ...prevState,
          image: null
        }));
      }
    }
  };

  const saveNewUser = async () => {

    if (!validateUserDetails()) {
      return;
    }

    const formData = new FormData();
    const userBlob = new Blob([JSON.stringify({
      name: userProvider.name,
      email: userProvider.email,
      pasword: userProvider.pasword,
      rol: {
        id: userProvider.rol.rolKey,
        rolName: userProvider.rol.originalName
      },
      properties: userProvider.properties || []
    })], { type: 'application/json' });
    formData.append('user', userBlob);

    if (userProvider.image) {
      formData.append('img', userProvider.image);
    }
    try {
      const data = await postNewUser(formData, t);
      if (data) {
        setUserSaved(!userSaved);
        setUserDialog(false);
        setUserProvider({});
      }
    } catch (error) {
    }
  };

  console.log(user)


  return (

    <>
      <Dialog
        header={t("dashboard.users.dialog-add-user.add-user")}
        visible={userDialog}
        onHide={handleClose}
        modal
        dismissableMask
        style={{ width: "40vw", display: "flex", justifyContent: "center" }}
        footer={
          <div className="w-full flex justify-center">

            <Button
              icon="pi pi-times"
              severity="danger"
              label={t("dashboard.users.dialog-add-user.cancel")}
              onClick={handleClose}
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
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <label htmlFor="username">{t("dashboard.users.dialog-add-user.name")}</label>
              {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}

            </span>
          </div>

          <div className="mb-6 mx-auto w-7/12">
            <span className="p-float-label w-full">
              <InputText
                id="email"
                value={userProvider.email}
                className="w-full"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <label htmlFor="email">{t("dashboard.users.dialog-add-user.email")}</label>
              {validationErrors.email && <small className="p-error">{validationErrors.email}</small>}
            </span>
          </div>

          <div className="mb-6 mx-auto w-7/12">
            <span className="p-float-label w-full">
              <Password
                id="password"
                toggleMask
                value={userProvider.pasword}
                onChange={(e) => handleInputChange('pasword', e.target.value)}
                className="w-full"
                header={header}
                footer={footer}
              />
              <label htmlFor="password">{t("dashboard.users.dialog-add-user.password")}</label>
              {validationErrors.pasword && <small className="p-error">{validationErrors.pasword}</small>}
            </span>
          </div>

          <div className="mb-6 mx-auto w-7/12">
            <label htmlFor="image">{t("dashboard.users.dialog-add-user.search-img")}</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="image" className="file-input-label">{t("dashboard.users.dialog-add-user.search-img")}</label>
              <span id="file-name" className="file-name">{userProvider.image ? userProvider.image.name : ''}</span>
              {validationErrors.image && <small className="p-error">{validationErrors.image}</small>}
            </div>
          </div>




          <div className="mx-auto w-7/12 ">
            <Dropdown
              value={userProvider.rol}
              onChange={(e) => {
                console.log("Nuevo valor de rol seleccionado:", e.value);
                setUserProvider(prev => ({
                  ...prev,
                  rol: {
                    rolKey: e.value.rolKey,
                    rolName: e.value.rolName,
                    originalName: e.value.originalName
                  }
                }));
                if (validationErrors.rol) {
                  setValidationErrors((prev) => {
                    const updatedErrors = { ...prev };
                    delete updatedErrors.rol;
                    return updatedErrors;
                  });
                }
              }}
              optionLabel="rolName"
              options={roles}
              placeholder={t("dashboard.users.dialog-add-user.roles.select-rol")}
              className="w-full"
            />
            {validationErrors.rol && <small className="p-error">{validationErrors.rol}</small>}
          </div>

        </div>
      </Dialog>

      <div className="mx-7 bg-white rounded-3xl overflow-auto">
        <div className="background">
          <Header title={t("dashboard.users.users-tittle")} />
          <div className="card flex justify-start ">
            {userRole == "Admin" ? (
              
              <button
                onClick={() => {
                  setUserDialog(true);
                  setUserProvider({});
                }} class="button"
              >
                {t("dashboard.users.add-user")}
                <AiOutlinePlusCircle/>
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>

        {loading ? <TableSkeleton /> : (
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
        )}
      </div>
    </>
  );
};
