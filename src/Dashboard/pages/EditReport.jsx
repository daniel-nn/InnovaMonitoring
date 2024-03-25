import React, { useContext, useEffect, useState, useMemo } from "react";
import { Header } from "../components";
import { UserContext } from "../../context/UserContext";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { getPropertiesInfo } from "../helper/getProperties";
import { getAgents } from "../helper/getAgents";
import { getIncidents } from "../helper/getIncidents";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import Swal from 'sweetalert2'
import { Dropdown } from "primereact/dropdown";
import { postReport } from "../helper/postReport";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { RadioButton } from 'primereact/radiobutton';
import exportPDF from "../helper/exportPdf"


const EditReport = () => {
    const { propertyContext, reportSaved, setreportSaved } = useContext(UserContext);
    const [t, i18n] = useTranslation("global");
    const navigate = useNavigate();

    const { reportForm, setReportForm } = useContext(UserContext);
    const { property, agent, dateOfReport, timeOfReport, incidentDate, incidentStartTime, incidentEndTime, caseType, level, company, numerCase, camerasFunctioning, listMalfuncioningCameras, observerdViaCameras, policeFirstResponderNotified, policeFirstResponderScene, securityGuardsNotified, securityGuardsScene, policeNumerCase, reportDetails, formNotificationClient, emailedReport, pdf, images, videos } = reportForm;
    console.log("EditReport data:", reportForm);

    const [properties, setProperties] = useState([]);
    const [agents, setAgents] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const levels = ["1", "2", "3", "4"];
    const team = ["Innova Monitoring", "Impro",];
    let user = JSON.parse(localStorage.getItem("user"));
    let userRole = user.role.roleName;
    useEffect(() => {
        const fetchProperties = async () => {
            const propertiesData = await getPropertiesInfo(navigate);
            setProperties(propertiesData);
        };

        fetchProperties();
    }, [navigate]);


    useEffect(() => {
        const fetchAgents = async () => {
            let agentsData = await getAgents();

           
            if (userRole === "Admin") {
                const adminOption = { id: user.id, name: user.name };
                agentsData = [adminOption, ...agentsData];
            }

           
            const formattedAgents = agentsData.map(agent => ({
                ...agent, // Mantén toda la estructura del agente

                label: agent.name, // Agrega un campo 'label' para mostrar en el Dropdown
            }));
            setAgents(formattedAgents);

          
            if (userRole === "Monitor") {

                
                setReportForm(prev => ({
                    ...prev,
                    agent: {
                        ...prev.agent,
                        name: user.name 
                    }
                }));
            }
        };

        fetchAgents();
    }, [setReportForm, userRole, user.id, user.name]);

    useEffect(() => {
        const fetchIncidents = async () => {
            const incidentsData = await getIncidents(navigate);
            setIncidents(incidentsData);
        };
        fetchIncidents();
    }, [navigate]);




    const malFunctionCameras = useMemo(() => [
        { label: t("dashboard.reports.edit-report.list-Malfuncion-cameras.na"), value: 'N/A' },
        { label: t("dashboard.reports.edit-report.list-Malfuncion-cameras.listedOnReport"), value: 'Listed on Report' }
    ], [t]);

    const [listpoliceFirstResponderScene, setlistpoliceFirstResponderScene] = useState([]);
    useEffect(() => {
        setlistpoliceFirstResponderScene([
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.yes"), value: 'Yes' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.no"), value: 'No' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.n/a"), value: 'N/A' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.fiat-security"), value: 'Fiat Security' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.security"), value: 'Security' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.police"), value: 'Police' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.firemen"), value: 'Firemen' },
            { label: t("dashboard.reports.edit-report.List-policeFirstResponderNotified.ambulance"), value: 'Ambulance' },
        ]);
    }, [t, i18n.language]);



    const [listNotificationClient, setlistNotificationClient] = useState([]);
    useEffect(() => {
        setlistNotificationClient([
            { label: t("dashboard.reports.edit-report.NotificationClient-list.email"), value: 'Email' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.call-mgr"), value: 'Call MGR' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.call-asst-mgr"), value: 'CALL ASST.MGR' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.text"), value: 'Text' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.email-call"), value: 'EMAIL & CALL' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.text-call"), value: 'TEXT & CALL' },
            { label: t("dashboard.reports.edit-report.NotificationClient-list.other"), value: 'OTHER' }
        ])
    }, [t, i18n.language]);

    const [listemailedReport, setemailedReport] = useState([]);
    useEffect(() => {
        setemailedReport([
            { label: t("dashboard.reports.edit-report.emaildReport-list.property-manager"), value: 'PROPERTY MANAGER' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.assitant-manager"), value: 'ASSISTANT MANAGER' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.ownership"), value: 'OWNERSHIP' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.corporate"), value: 'CORPORATE' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.security-guard"), value: 'SECURITY GUARD' },
            { label: t("dashboard.reports.edit-report.emaildReport-list.staff"), value: 'STAFF' }
        ])
    }, [t, i18n.language])

    const [headerTitle, setHeaderTitle] = useState('');

    useEffect(() => {
        const updateTitle = () => {
            if (reportForm.property && reportForm.property.name) {
                const newTitleWithProperty = `${t('dashboard.reports.edit-report.edit-report-with-property')} ${reportForm.property.name}`;
                setHeaderTitle(newTitleWithProperty);
            } else {
                const newTitle = t('dashboard.reports.edit-report.edit-tittle');
                setHeaderTitle(newTitle);
            }
        };
        updateTitle();
        i18n.on('languageChanged', updateTitle);
        return () => {
            i18n.off('languageChanged', updateTitle);
        };
    }, [i18n, t, reportForm.property]);

    const reportDtoPdf = async (reportForm) => {
        console.log('reportForm recibido:', reportForm);
        const {
            agent,
            caseType,
            company,
            level,
            numerCase,
            property,
            camerasFunctioning,
            listMalfuncioningCameras,
            observerdViaCameras,
            policeFirstResponderNotified,
            policeFirstResponderScene,
            securityGuardsNotified,
            securityGuardsScene,
            policeNumerCase,
            formNotificationClient,
            emailedReport,
            reportDetails

        } = reportForm;
        let reportDtoPdf = {
            agent: reportForm.agent.name,
            caseType: reportForm.caseType.incident,
            company,
            level,
            numerCase,
            property,
            propertyAddress: property ? property.direction : 'Dirección no proporcionada',
            propertyrgb: property ? property.rgbcolor : '255, 255 ,255',
            listMalfuncioningCameras,
            observerdViaCameras: observerdViaCameras ? 1 : 0,
            policeFirstResponderNotified: policeFirstResponderNotified ? 1 : 0,
            policeFirstResponderScene,
            camerasFunctioning: camerasFunctioning ? 1 : 0,
            securityGuardsNotified: securityGuardsNotified ? 1 : 0,
            securityGuardsScene: securityGuardsScene ? 1 : 0,
            policeNumerCase,
            formNotificationClient,
            emailedReport,
            reportDetails,
            dateOfReport: formatDate(reportForm.dateOfReport),
            timeOfReport: formatTime(reportForm.timeOfReport),
            incidentDate: formatDate(reportForm.incidentDate),
            incidentStartTime: formatTime(reportForm.incidentStartTime),
            incidentEndTime: formatTime(reportForm.incidentEndTime),

        };
        return reportDtoPdf;
    };

    const formatDate = (date) => {
        if (!date) date = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}-${day}-${date.getFullYear()}`;
    };


    const formatTime = (date) => {
        if (!date) date = new Date();
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const saveReport = async (reportForm) => {
        let evidences = [];
        let images = reportForm.images || [];
        let videos = reportForm.videos || [];

        if (reportForm.images?.length > 0) {
            images = reportForm.images?.split(",") || [];
        }
        if (reportForm.videos?.length > 0) {
            videos = reportForm.videos?.split(",") || [];
        }
        images.forEach((img) => {
            evidences.push({
                link: img,
                name: "Img",
            });
        });



        videos.forEach((vid) => {
            evidences.push({
                link: vid,
                name: "Vid",
            });
        });

        const {
            agent,
            caseType,
            company,
            level,
            numerCase,
            property,
            camerasFunctioning,
            listMalfuncioningCameras,
            observerdViaCameras,
            policeFirstResponderNotified,
            policeFirstResponderScene,
            securityGuardsNotified,
            securityGuardsScene,
            policeNumerCase,
            formNotificationClient,
            emailedReport,
            reportDetails,
            pdf
        } = reportForm;
        let reportDto = {
            agent: reportForm.agent,
            caseType,
            company,
            level,
            numerCase,
            property,
            listMalfuncioningCameras,
            camerasFunctioning: camerasFunctioning ? 1 : 0,
            observerdViaCameras: observerdViaCameras ? 1 : 0,
            policeFirstResponderNotified: policeFirstResponderNotified ? 1 : 0,
            policeFirstResponderScene,
            securityGuardsNotified: securityGuardsNotified ? 1 : 0,
            securityGuardsScene: securityGuardsScene ? 1 : 0,
            policeNumerCase,
            formNotificationClient,
            emailedReport,
            reportDetails,
            pdf,
            evidences,
            dateOfReport: formatDate(reportForm.dateOfReport),
            timeOfReport: formatTime(reportForm.timeOfReport),
            incidentDate: formatDate(reportForm.incidentDate),
            incidentStartTime: formatTime(reportForm.incidentStartTime) + ' ' + formatTime(reportForm.incidentStartTime),
            incidentEndTime: formatTime(reportForm.incidentEndTime) + ' ' + formatTime(reportForm.incidentEndTime),
        };

        await postReport(reportDto);
        setreportSaved(!reportSaved);
    };
    const sendingreport = () => {
        const swalStyles = `
            .swal2-confirm-button-success {
                background-color: rgb(50,135,64);
                color: white;
                border: none;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                font-size: 1rem;
                margin-right: 0.5rem;
            }

            .swal2-deny-button {
                background-color: #ff5f57; /* Rojo para 'Don't save' */
                color: white;
                border: none;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                font-size: 1rem;
                margin-right: 0.5rem;
            }

            .swal2-cancel-button {
                background-color: gray; /* Gris para 'Cancel' */
                color: white;
                border: none;
                border-radius: 0.25rem;
                padding: 0.5rem 1rem;
                font-size: 1rem;
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = swalStyles;
        document.head.appendChild(styleSheet);
        const propertyName = reportForm.property?.name ?? ' ';
        const confirmationTitle = t("dashboard.reports.edit-report.swal.confirmation") + propertyName;
        Swal.fire({
            title: confirmationTitle,
            icon: "info",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="pi pi-check"></i> ' + t("dashboard.reports.edit-report.swal.send"),
            denyButtonText: `<i class="pi pi-times"></i> ` + t("dashboard.reports.edit-report.swal.don't-save"),

            cancelButtonText: t("dashboard.reports.edit-report.swal.cancel"),
            buttonsStyling: false,
            customClass: {
                confirmButton: 'swal2-confirm-button-success',
                denyButton: 'swal2-deny-button',
                cancelButton: 'swal2-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                saveReport(reportForm).then(() => {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "success",
                        title: t("dashboard.reports.edit-report.swal.report-send")
                    });
                }).catch((error) => {

                    console.error("Error saving the report:", error);
                });
            } else if (result.isDenied) {
                setReportForm({
                    id: "",
                    property: {},
                    agent: {},
                    dateOfReport: new Date(),
                    timeOfReport: new Date(),
                    incidentDate: new Date(),
                    incidentStartTime: new Date(),
                    incidentEndTime: new Date(),
                    caseType: {},
                    level: "",
                    company: "",
                    numerCase: "",
                    camerasFunctioning: true,
                    listMalfuncioningCameras: "",
                    observerdViaCameras: true,
                    policeFirstResponderNotified: false,
                    policeFirstResponderScene: "",
                    securityGuardsNotified: false,
                    securityGuardsScene: false,
                    policeNumerCase: "",
                    formNotificationClient: "",
                    emailedReport: "",
                    reportDetails: "",
                    pdf: "",
                    images: [],
                    videos: [],
                });
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: t("dashboard.reports.edit-report.swal.canceled-report")
                });

            }
        });
        return () => {
            document.head.removeChild(styleSheet);
        };

    }


    return (
        <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
            <Header title={headerTitle} />
            <div className="flex flex-wrap -mx-3">

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="propertyType" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-property")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-home"></i>
                        </span>
                        <Dropdown
                            value={properties.find(p => p.id === property.id)} // Encuentra el objeto completo basado en el ID
                            onChange={(e) => {
                                setReportForm(prevForm => ({
                                    ...prevForm,
                                    property: e.value // Aquí pasas el objeto completo de la propiedad
                                }));
                            }}
                            options={properties}
                            optionLabel="name"
                            placeholder={t("dashboard.reports.edit-report.property")}
                            className="w-full"
                        />
                    </div>
                    <button onClick={() => console.log(agents || "agentes no encontrado")}>agentes</button>

                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="agentType" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-agent")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        <button onClick={() => console.log(agents.find(a => a.id === reportForm.agent.id)?.id || "id agente no encontrado")}>idagente</button>
                        {userRole === "Admin" ? (
                            <Dropdown
                                value={reportForm.agent.name} // Encuentra el agente actual basado en el ID
                                onChange={(e) => setReportForm((prev) => ({ ...prev, agent: e.value }))}
                                options={agents}
                                optionLabel="label" // Usa 'label' para mostrar nombres en el Dropdown
                                placeholder={t("dashboard.reports.edit-report.agent")}
                                className="w-full"
                            />
                        ) : (
                            <div className="w-full p-inputtext p-component p-disabled" style={{ lineHeight: '1.5', padding: '0.5em 1em', border: '1px solid #c8c8c8', borderRadius: '4px', background: '#f8f8f8' }}>
                                <span>{reportForm.agent.name}</span>
                            </div>
                        )}
                       

                        <button onClick={() => console.log(agents.find(a => a.id === reportForm.agent.id)?.name || "Agente no encontrado")}>agente</button>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-number-case")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={numerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, numerCase: e.value };
                        })} placeholder={t("dashboard.reports.edit-report.number-case")}
                            mode="decimal" minFractionDigits={0} />

                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="dateOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-date-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.date-of-report-placeholder")}
                            value={dateOfReport}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, dateOfReport: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="timeOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-time-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.time-of-report-placeholder")}
                            value={timeOfReport}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, timeOfReport: e.value };
                            })}
                            timeOnly
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentDate" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-date-of-incident")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.date-of-incident-placeholder")}
                            value={incidentDate}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentDate: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentStartTime" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-incident-start-time")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.incident-start-time-placeholder")}
                            value={incidentStartTime}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentStartTime: e.value };
                            })}
                            timeOnly
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentEndTime" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-incident-end-time")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.edit-report.incident-end-time-placeholder")}
                            value={incidentEndTime}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentEndTime: e.value };
                            })}
                            timeOnly
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="caseType" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-incident")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={caseType}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, caseType: e.value };
                            })}
                            options={incidents}
                            optionLabel="incident"
                            placeholder={t("dashboard.reports.edit-report.incident")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-report-level")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-chart-bar"></i>
                        </span>
                        <Dropdown
                            value={level}
                            onChange={(e) => setReportForm((i) => {
                                return { ...reportForm, level: e.value };
                            })}
                            options={levels}
                            placeholder={t("dashboard.reports.edit-report.level")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="company" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-company")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={company}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, company: e.value };
                            })}
                            options={team}
                            placeholder={t("dashboard.reports.edit-report.monitoring-team")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="camerasfunctioning" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-is-cameras-funcioning")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="camerasFunctioning"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        camerasFunctioning: e.value
                                    }));
                                }}
                                checked={reportForm.camerasFunctioning === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="camerasFunctioning"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        camerasFunctioning: e.value
                                    }));
                                }}
                                checked={reportForm.camerasFunctioning === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="MalfuncioningCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.listMalfuncioningCameras")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-camera"></i>
                        </span>
                        <Dropdown
                            value={listMalfuncioningCameras}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                listMalfuncioningCameras: e.value
                            }))}
                            options={malFunctionCameras}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.selectMalfunctioningCamerasPlaceholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="observerdViaCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.select-observerdViaCameras")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="observerdViaCameras"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        observerdViaCameras: e.value
                                    }));
                                }}
                                checked={reportForm.observerdViaCameras === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="observerdViaCameras"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        observerdViaCameras: e.value
                                    }));
                                }}
                                checked={reportForm.observerdViaCameras === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.is-policeFirstResponderNotified")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="camerasYes"
                                name="policeFirstResponderNotified"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        policeFirstResponderNotified: e.value
                                    }));
                                }}
                                checked={reportForm.policeFirstResponderNotified === true}
                            />
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="camerasNo"
                                name="policeFirstResponderNotified"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        policeFirstResponderNotified: e.value
                                    }));
                                }}
                                checked={reportForm.policeFirstResponderNotified === false}
                            />
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.police-first-responder-scene")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={policeFirstResponderScene}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                policeFirstResponderScene: e.value
                            }))}
                            options={listpoliceFirstResponderScene}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.policeFirstResponderSceneeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.securityGuardsNotified")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="securityGuardsNotifiedYes"
                                name="securityGuardsNotified"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsNotified: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsNotified === true}
                            />
                            <label htmlFor="securityGuardsNotifiedYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="securityGuardsNotifiedNo"
                                name="securityGuardsNotified"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsNotified: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsNotified === false}
                            />
                            <label htmlFor="securityGuardsNotifiedNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsScene" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.securityGuardsScene")}
                    </label>
                    <div className="flex justify-center">
                        <div className="flex align-items-center mr-2">
                            <RadioButton
                                inputId="securityGuardsSceneYes"
                                name="securityGuardsScene"
                                value={true}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsScene: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsScene === true}
                            />
                            <label htmlFor="securityGuardsSceneYes" className="ml-2">{t("dashboard.reports.edit-report.yes")}</label>
                        </div>
                        <div className="flex align-items-center ml-4">
                            <RadioButton
                                inputId="securityGuardsSceneNo"
                                name="securityGuardsScene"
                                value={false}
                                onChange={(e) => {
                                    console.log('Seleccionado:', e.value);
                                    setReportForm(prevForm => ({
                                        ...prevForm,
                                        securityGuardsScene: e.value
                                    }));
                                }}
                                checked={reportForm.securityGuardsScene === false}
                            />
                            <label htmlFor="securityGuardsSceneNo" className="ml-2">{t("dashboard.reports.edit-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeNumerCase" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.policeNumerCase")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={policeNumerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, policeNumerCase: e.value };
                        })} placeholder={t("dashboard.reports.edit-report.policeNumerCase-placeholder")}
                            mode="decimal" minFractionDigits={0} />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="NotificationClient" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.NotificationClient")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={formNotificationClient}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                formNotificationClient: e.value
                            }))}
                            options={listNotificationClient}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.NotificationClient-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="emaildReport" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.emaildReport")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-list"></i>
                        </span>
                        <Dropdown
                            value={emailedReport}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                emailedReport: e.value
                            }))}
                            options={listemailedReport}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.edit-report.emaildReport-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-2/4 px-3 mb-6 text-center">
                    <label htmlFor="images" className="font-bold block mb-2">
                        {t("imagenes")}
                    </label>
                    <div className="p-inputgroup">
                        <InputTextarea
                            value={reportForm.images}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                images: e.target.value
                            }))}
                            rows={5}
                            cols={30}
                            autoResize
                            placeholder={t("Imagenes")}
                        />
                    </div>
                </div>

                <div className="w-2/4 px-3 mb-6 text-center">
                    <label htmlFor="videos" className="font-bold block mb-2">
                        {t("videos")}
                    </label>
                    <div className="p-inputgroup">
                        <InputTextarea
                            value={reportForm.videos}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                videos: e.target.value
                            }))}
                            rows={5}
                            cols={30}
                            autoResize
                            placeholder={t("Videos")}
                        />
                    </div>
                </div>


                <div className="w-full px-3 mb-6">
                    <label htmlFor="reportDetails" className="font-bold block mb-2">
                        {t("dashboard.reports.edit-report.report-details")}
                    </label>
                    <div className="p-inputgroup">
                        <InputTextarea
                            value={reportForm.reportDetails}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                reportDetails: e.target.value
                            }))}
                            rows={5}
                            cols={30}
                            autoResize
                            placeholder={t("dashboard.reports.edit-report.report-details-placeholder")}
                        />
                    </div>
                </div>


            </div>


            <div className="flex justify-end mt-4 pr-20">
                <Button label={t("dashboard.reports.edit-report.swal.send")} severity="success" onClick={sendingreport} />
                <Button
                    label="pdf"
                    severity="success"
                    onClick={async () => {
                        try {
                            const dataForPdf = await reportDtoPdf(reportForm);
                            console.log(dataForPdf);
                            await exportPDF(dataForPdf);
                        } catch (error) {
                            console.error('Error al generar el PDF:', error);
                        }
                    }}
                />
            </div>
        </div>

    );
};

export default EditReport;