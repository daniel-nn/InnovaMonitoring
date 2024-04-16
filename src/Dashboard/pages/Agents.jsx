import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, Search, Inject,} from "@syncfusion/ej2-react-grids";
import { contextMenuItems, orderAgents, orderAgentsAdmin } from "../data/dummy";
import { Header } from "../components";
import { getIncidents } from "../helper/getIncidents";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "reactstrap";
import { UserContext } from "../../context/UserContext";
import { postNewAgent } from "../helper/postNewAgent";
import { getUserRolMonitor } from "../helper/getUserRolMonitor";
import { useTranslation } from "react-i18next";

export const Agents = () => {
  const toolbarOptions = ["Search"];
  const { navigate } = useNavigate();
  const [t, i18n] = useTranslation("global");

  const [agentData, setAgentData] = useState([]);
  const [visible, setVisible] = useState(false);
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;
  const {agentProvider, setagentProvider, agentDialog, setAgentDialog, flag} = useContext(UserContext);

  useEffect(() => {
    const fetchMonitors = async () => {
      const monitors = await getUserRolMonitor(navigate);
      setAgentData(monitors);
    };

    fetchMonitors();
  }, [navigate]);


  return (
    <>
      <Dialog
        header="Add Agent"
        visible={agentDialog}
        style={{ width: "30vw", display: "flex", justifyContent: "center" }}
        onHide={() => setAgentDialog(false)}
        footer={
          <div className="w-full flex justify-end">
            <Button icon="pi pi-times" severity="danger" label="Cancel" />
            <div className="w-3"></div>
          </div>
        }
      >
        <div className="w-full flex flex-col mx-auto">
          <div className="mt-6 mb-6 mx-auto">
            <span className="p-float-label">
              <InputText id="username" value={agentProvider.name} onChange={(e) => setagentProvider((i) => {
              return { ...agentProvider, name:e.target.value };
            })} />
              <label htmlFor="username">Name</label>
            </span>
          </div>

          <div className="mb-6  mx-auto">
            <span className="p-float-label">
              <InputText id="username"  value={agentProvider.lastName} onChange={(e) => setagentProvider((i) => {
              return { ...agentProvider, lastName:e.target.value };
            })}/>
              <label htmlFor="username">LastName</label>
            </span>
          </div>
          <div className=" mb-6 mx-auto">
            <span className="p-float-label">
              <InputText  value={agentProvider.email} onChange={(e) => setagentProvider((i) => {
              return { ...agentProvider, email:e.target.value };
            })} id="username" />
              <label htmlFor="username">Email</label>
            </span>
          </div>

          <div className="mx-auto">
            <span className="p-float-label">
              <InputText id="username"  value={agentProvider.image} onChange={(e) => setagentProvider((i) => {
              return { ...agentProvider, image:e.target.value };
            })} />
              <label htmlFor="username">Image URL</label>
            </span>
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
          onClick={() => {setAgentDialog(!agentDialog)}}
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
