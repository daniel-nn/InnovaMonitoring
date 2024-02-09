import React, { useContext, useEffect, useState } from "react";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { GetReports } from "../helper/GetReports";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";


const NewReport = ({ properties, agents, incidents }) => {

    


    let propertiesUser = JSON.parse(localStorage.getItem("user"));
    const { propertyContext, reportSaved } = useContext(UserContext);

    const [t, i18n] = useTranslation("global");


    useEffect(() => {
        
        GetReports(propertyContext.id, propertiesUser.rol?.rolName).then((data) => {
         
        });
    }, [propertyContext, propertiesUser.rol?.rolName, t, i18n.language, reportSaved]);

    const navigate = useNavigate();
    const navigatetoreports = () => {
        navigate("/dashboard/reports")
    }
    return (
        <>
            <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
            <Header category={t("dashboard.reports.new-report.new-report")} title={t("dashboard.reports.new-report.new-report-of") + t("space") + propertyContext.name} />
                <div className="card flex justify-end py-2 mb-7">

                </div>
            </div>
            
            <div className="flex justify-end mt-4 pr-20">
                <Button label={t("dashboard.reports.new-report.cancel")} icon="pi pi-times" style={{ marginRight: "1%" }} severity="danger" onClick={(navigatetoreports)} />
                <Button label={t("dashboard.reports.new-report.send")} icon="pi pi-check" severity="success" onClick={console.log("acá va handleSubmit")} />
            </div>
        </>
    );
};

export default NewReport;