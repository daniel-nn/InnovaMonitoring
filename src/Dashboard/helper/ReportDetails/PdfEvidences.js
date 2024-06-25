
import React from "react";
import { AiFillFilePdf } from "react-icons/ai";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { exportPdfEvidences } from "./exportPdfEvidences";

//Plantilla que va a la creación del pdf en las evidencias
export const PdfEvidences = (props) => {
    const [t, i18n] = useTranslation("global");
    const { id, refreshReports } = props;

    const handlePDFClick = async () => {
        if (!id) {
            Swal.fire(t("dashboard.reports.table.admin.no-pdf"));
        } else {
            console.log("Esto es la data del PDF:", props);
            try {
                await exportPdfEvidences(props);
            } catch (error) {
                console.error('Error al generar el PDF:', error);
                Swal.fire(t("Error"), t("dashboard.reports.table.admin.pdf-error"), "error");
            }
        }
    };

    return (
        <button onClick={handlePDFClick} className="flex justify-center m-0 p-0">
            <AiFillFilePdf className="text-lg text-red-600"></AiFillFilePdf>
        </button>
    );
};
