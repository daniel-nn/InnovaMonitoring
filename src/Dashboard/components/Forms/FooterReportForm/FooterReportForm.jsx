import React, { useContext, useRef, useState } from 'react'; 
import { Steps } from 'primereact/steps';
import { Toast } from 'reactstrap';
import { UserContext } from '../../../../context/UserContext';
import { useTranslation } from 'react-i18next';
import "./FooterReportForm.css"

export const FooterReportForm = ({setInformation}) => {
    const [t] = useTranslation("global");
    const [activeIndex, setActiveIndex] = useState(0);
    const toast = useRef(null);
    const items = [
        {
            label: t("dashboard.reports.new-report.footer.information"),
            command: (event) => {
                setInformation(true)
                } 
        },
        {
            label: t("dashboard.reports.new-report.footer.evidences"),
           command: (event) => {
            setInformation(false)
            } 
        },
       
    ];

    return (
        <div className="card">
            <Toast ref={toast}></Toast>
            <Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false}/>
        </div>
    )
}


