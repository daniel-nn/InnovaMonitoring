import { useContext } from 'react';
import Swal from 'sweetalert2';
import { UserContext } from '../../context/UserContext';

  const formatDate = (date) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}-${date.getFullYear()}`;
  };

const formatTime = (date) => {
  if (!date) {
    return null; // Retorna null directamente si la fecha es null o undefined
  }
  if (typeof date === 'string') {
    date = new Date(date);
  }
  let hours = date.getHours().toString().padStart(2, '0');
  let minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
export const postReport = async (reportForm, t, setCreatingReport, userId) => {
  const formData = new FormData();

  formData.append("report", new Blob([JSON.stringify({
    createdBy: reportForm.createdBy,
    caseType: reportForm.caseType,
    company: reportForm.company,
    level: reportForm.level,
    numerCase: reportForm.numerCase,
    property: reportForm.property,
    listMalfunctioningCameras: reportForm.listMalfunctioningCameras,
    camerasFunctioning: reportForm.camerasFunctioning ? 1 : 0,
    observerdViaCameras: reportForm.observerdViaCameras ? 1 : 0,
    policeFirstResponderNotified: reportForm.policeFirstResponderNotified ? 1 : 0,
    policeFirstResponderScene: reportForm.policeFirstResponderScene,
    securityGuardsNotified: reportForm.securityGuardsNotified ? 1 : 0,
    securityGuardsScene: reportForm.securityGuardsScene ? 1 : 0,
    policeNumerCase: reportForm.policeNumerCase,
    formNotificationClient: reportForm.formNotificationClient,
    emailedReport: reportForm.emailedReport,
    reportDetails: reportForm.reportDetails,
    pdf: reportForm.pdf,
    dateOfReport: formatDate(reportForm.dateOfReport),
    timeOfReport: formatTime(reportForm.timeOfReport),
    incidentDate: formatDate(reportForm.incidentDate),
    incidentStartTime: formatTime(reportForm.incidentStartTime),
    incidentEndTime: reportForm.persist ? null : formatTime(reportForm.incidentEndTime), // Envía null si persist es true
    persist: reportForm.persist,
  })], { type: 'application/json' }));

  // Se cada archivo de las evidencias
  reportForm.evidences.forEach((evidence) => {
    formData.append('evidences', evidence.file); 
  });

  const url = `${process.env.REACT_APP_SERVER_IP}/reports`;

  try {
    console.log("User id")
    console.log(userId)
    const response = await fetch(url, {

      method: 'POST',
      headers: {
        "Userid": userId,
        // Otras cabeceras si es necesario
    },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t("dashboard.reports.new-report.swal.report-send"),
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
      });
          
      setCreatingReport(false);
      return data;
    } else {
      throw new Error(data.message || t("dashboard.reports.new-report.swal.error-saving"));
    }
  } catch (error) {
    console.error("Error saving the report:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || t("dashboard.reports.new-report.swal.error-saving")
    });
    return null;
  }
};