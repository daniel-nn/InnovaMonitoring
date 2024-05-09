import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids'
import i18next from 'i18next'
import React, { useEffect, useState, useMemo } from 'react';
import { Button } from "primereact/button";
import { propertiesUserGridAdmin, propertiesUserGrid, assignproperties } from '../data/dummy'
import { useTranslation } from 'react-i18next'
import { getNontPropertiesUser } from '../helper/userProfile/properties/getNontPropertiesUser';

const GridPropertiesProfile = ({ properties, userId, setUserData }) => {
  const [t, i18n] = useTranslation("global");
  let user = JSON.parse(localStorage.getItem("user"));
  let userRole = user.role.rolName;

  const [dataToShow, setDataToShow] = useState(properties);
  const [activeView, setActiveView] = useState('default');

  // Función para recargar propiedades actualizadas
  const fetchUpdatedProperties = async () => {
    try {
      const nonAssignedProperties = await getNontPropertiesUser(userId);
      console.log("Updated non-assigned properties:", nonAssignedProperties);
      setDataToShow(nonAssignedProperties);
    } catch (error) {
      console.error('Error fetching updated properties:', error);
    }
  };

  const columns = useMemo(() => {
    if (activeView === 'default') {
      return userRole === "Admin" ? propertiesUserGridAdmin(t, userId, setUserData) : propertiesUserGrid(t, userId, setUserData);
    }
    return assignproperties(t, userId, setUserData, fetchUpdatedProperties);
  }, [t, userId, setUserData, userRole, activeView]);

  const handleViewChange = () => {
    if (activeView === 'default') {
      fetchUpdatedProperties();
      setActiveView('assign');
    } else {
      setDataToShow(properties);
      setActiveView('default');
    }
  };

  useEffect(() => {
    setDataToShow(properties);
  }, [properties]);

  return (
    <div>
          
        <div className="flex justify-between align-middle p-6 mt-10">
        <h2 className="text-3xl text-primary font-bold sm:te  xt-xl">
          {t("dashboard.user-details.properties.assigned-properties")}
          </h2>
        {userRole === "Admin" && (
          <Button
            label={t(activeView === 'default' ? "dashboard.user-details.properties.assign-properties" : "dashboard.user-details.properties.properties-user")}
            className="p-button-text ml-2"
            onClick={handleViewChange}
          />
        )}
        </div>
      <GridComponent
        id="userGrid"
        dataSource={dataToShow}
        key={`${activeView}-${i18n.language}-${dataToShow.length}`}  // Utilizar una clave que cambie con los datos
        allowPaging
        allowSorting
        toolbar={["Search"]}
      >
        <ColumnsDirective>
          {columns.map((column, index) => (
            <ColumnDirective key={index} {...column} />
          ))}
        </ColumnsDirective>
      </GridComponent>
    </div>
  )
}

export default GridPropertiesProfile