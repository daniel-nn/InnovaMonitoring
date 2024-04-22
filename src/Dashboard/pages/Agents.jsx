import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, Inject,} from "@syncfusion/ej2-react-grids";
import { contextMenuItems, orderAgents, orderAgentsAdmin } from "../data/dummy";
import { Header } from "../components";
import { getIncidents } from "../helper/getIncidents";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { UserContext } from "../../context/UserContext";
import { getUserRolMonitor } from "../helper/getUserRolMonitor";
import { useTranslation } from "react-i18next";
import { postNewUser } from "../helper/postNewUser";
import { getRoles } from "../helper/getRoles";
import Swal from 'sweetalert2';
import { getPropertiesInfo } from "../helper/getProperties";


export const Agents = () => {

  const toolbarOptions = ["Search"];
  const { navigate } = useNavigate();
  const [t, i18n] = useTranslation("global");
  const [userDialog, setUserDialog] = useState(false);
  const [agentData, setAgentData] = useState([]);
  const [visible, setVisible] = useState(false);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  const { userProvider, setUserProvider, agentDialog, setAgentDialog, flag} = useContext(UserContext);
  const [userSaved, setUserSaved] = useState(false);
  const [roles, setRoles] = useState([]);


  const fetchMonitors = async () => {
    const monitors = await getUserRolMonitor(navigate);
    setAgentData(monitors);
  };

  useEffect(() => {
    fetchMonitors();
  }, [navigate]); 

  useEffect(() => {
    const fetchRoles = async () => {
      const rolesData = await getRoles();
      if (rolesData && rolesData.length > 0) {
        const rolesArray = rolesData.map(({ id, rolName }) => ({
          rolKey: id,
          rolName: t(`dashboard.agents.dialog-add-agent.roles.roles-dropdown.${rolName}`),
          originalName: rolName
        }));

        setRoles(rolesArray);
        const monitorRole = rolesArray.find(role => role.originalName === "Monitor");
        if (monitorRole) {
          setUserProvider(prev => ({
            ...prev,
            rol: {
              rolKey: monitorRole.rolKey,
              rolName: monitorRole.rolName,
              originalName: monitorRole.originalName  // Asegúrate de incluir originalName aquí
            }
          }));
        }
      } else {
        console.log('No roles data found');
      }
    };
    fetchRoles();
  }, [t, setUserProvider]);


  const header = <div className="font-bold mb-3">{t("dashboard.agents.dialog-add-agent.suggestion.pick-password")}</div>;
  const footer = (
    <>
      <Divider />
      <p className="mt-2">{t("dashboard.agents.dialog-add-agent.suggestion.suggestions")}</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-lowercase")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-uppercase")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.at-least-one-numeric")}</li>
        <li>{t("dashboard.agents.dialog-add-agent.suggestion.minimum-characters")}</li>
      </ul>
    </>
  );




  const saveNewUser = async () => {
    const userToSend = {
      name: userProvider.name,
      email: userProvider.email,
      pasword: userProvider.pasword,
      image: userProvider.image,
      rol: {
        id: userProvider.rol.rolKey,
        rolName: userProvider.rol.originalName
      },
      properties: userProvider.properties || []
    };

    try {
      const data = await postNewUser(userToSend);
      if (data && !data.error) {  
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: "The agent has been created correctly",
          timer: 3000
        });
        setUserSaved(userSaved => !userSaved);  // Cambio de estado para disparar recarga
        setUserDialog(false);
        setUserProvider({});
        fetchMonitors(); 
      } else {
        throw new Error(data.message || 'Failed to create agent');
      }
    } catch (error) {
      console.error("Error al enviar datos:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.toString(),
      });
    }
  };


  const handleClose = () => {
    setUserDialog(false);
    setUserProvider({});
  };

  return (


    <>
      <Dialog
        header={t("dashboard.agents.dialog-add-agent.add-agent")}
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
              label={t("dashboard.agents.dialog-add-agent.cancel")}
              onClick={handleClose}
            />
            <div className="w-3"></div>
            <Button
              icon="pi pi-check"
              label={t("dashboard.agents.dialog-add-agent.send")}
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
              <label htmlFor="username">{t("dashboard.agents.dialog-add-agent.name")}</label>
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
              <label htmlFor="username">{t("dashboard.agents.dialog-add-agent.email")}</label>
            </span>
          </div>

          <div className=" mb-6 mx-auto w-7/12 flex justify-center">
            <span className="p-float-label w-full">
              <Password
                toggleMask
                value={userProvider.pasword}
                onChange={(e) => setUserProvider({ ...userProvider, pasword: e.target.value })}
                className="w-full"
                header={header}
                footer={footer}
                promptLabel={t("dashboard.agents.dialog-add-agent.suggestion.enter-password")}
                weakLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.weak")}
                mediumLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.medium")}
                strongLabel={t("dashboard.agents.dialog-add-agent.suggestion.password-strength.strong")}
              />


              <label htmlFor="Password">{t("dashboard.agents.dialog-add-agent.password")}</label>
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
              <label htmlFor="image">{t("dashboard.agents.dialog-add-agent.image-url")}</label>
            </span>
          </div>


          <div className="mb-6 mx-auto w-7/12 flex justify-center">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <div className="w-full p-inputtext p-component">
                <span>{t("dashboard.agents.dialog-add-agent.roles.roles-dropdown.Monitor")}</span>
              </div>
            </div>
          </div>

        </div>
      </Dialog>
      <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Header title={t("dashboard.agents.agents-tittle")} />
        <div className="card flex justify-end py-2">
        {userRole == "Admin" ? (
          <Button
          severity="info"
          label={t("dashboard.agents.add-agent")}
          className="p-button-text ml-2"

              onClick={() => setUserDialog(prev => !prev)}
        >
          <AiOutlinePlusCircle className="ml-2"></AiOutlinePlusCircle>
        </Button>
          ) : (
            <></>
          )}
      
        </div>

        <GridComponent
          id="gridcomp"
          key={i18n.language}
          dataSource={agentData}
          allowPaging
          allowSorting
          allowExcelExport
          contextMenuItems={contextMenuItems}
          toolbar={toolbarOptions}
        >
          <ColumnsDirective>
            {orderAgentsAdmin(t).map((column, index) => (
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
              Search,
            ]}
          />
        </GridComponent>
      </div>
    </>
  );
};
