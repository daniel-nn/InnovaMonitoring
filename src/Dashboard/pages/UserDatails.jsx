import React, { useContext } from "react";
import { PersonalProfile } from "../components/PersonalProfile";
import {
  ColumnDirective,
  ColumnsDirective,
  ContextMenu,
  GridComponent,
  Inject,
  Page,
  PdfExport,
  Resize,
} from "@syncfusion/ej2-react-grids";
import i18next from "i18next";
import { Filter, Search, Sort } from "@mui/icons-material";
import { propertiesGrid, userGrid } from "../data/dummy";
import { useTranslation } from "react-i18next";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Button } from "primereact/button";
import GridPropertiesProfile from "../components/GridPropertiesProfile";

export const UserDatails = () => {
  const { userProvider, setUserProvider } = useContext(UserContext);
  const { name, properties } = userProvider;
  const [t, i18n] = useTranslation("global");
  const [window, setWindow] = useState(true);

  console.log(userProvider);

  //bg-[#c2880b]
  return (
    <div className="bg-white w-full flex flex-col gap-5 px-4 md:px-8 md:flex-row text-[#161931]">
     
      <aside className="hidden py-4 min-w-[200px] md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Panel</h2>

          <button
            onClick={() => setWindow((prev) => !prev)}
            href="#"
            className="flex items-center px-3 py-2.5 font-bold bg-white  text-primary border rounded-full"
          >
            Personal Profile
          </button>
          <button
            onClick={() => setWindow((prev) => !prev)}
            href="#"
            className="flex items-center px-3 py-2.5 font-semibold  hover:text-primary hover:border hover:rounded-full"
          >
            Properties
          </button>
        </div>
      </aside>

      {window === true ? (
        <PersonalProfile userProvider={userProvider} />
      ) : (
        <GridPropertiesProfile properties={properties} />
      )}
    </div>
  );
};
