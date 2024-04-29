import { ColumnDirective, ColumnsDirective, GridComponent } from '@syncfusion/ej2-react-grids'
import i18next from 'i18next'
import React from 'react'
import { Button } from 'reactstrap'
import { propertiesUserGrid } from '../data/dummy'
import { useTranslation } from 'react-i18next'

const GridPropertiesProfile = ({ properties, userId, setUserData }) => {
    const [t, i18n] = useTranslation("global");
  return (
    <div>
          
        <div className="flex justify-between align-middle p-6 mt-10">
        <h2 className="text-3xl text-primary font-bold sm:te  xt-xl">
          {t("dashboard.user-details.properties.assigned-properties")}
          </h2>
          <Button severity="info" label="Assign property" />
        </div>
      <GridComponent    
        id="userGrid"
        dataSource={properties}
        key={t.language}
        allowPaging
        allowSorting
        toolbar={["Search"]}
      >
        <ColumnsDirective>
          {propertiesUserGrid(t, userId, setUserData).map((column, index) => (
            <ColumnDirective key={index} {...column} />
          ))}
        </ColumnsDirective>
      </GridComponent>
        </div>
  )
}

export default GridPropertiesProfile