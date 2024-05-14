import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
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
import Stomp from 'stompjs';
import { Toast } from 'primereact/toast';
import exportPDF from "../helper/exportPdf"
import { getAdminsAndMonitors } from "../helper/getUserAdminsaAndMonitors";
import { FileUpload } from 'primereact/fileupload';
import "../pages/css/Reports/NewReport.css"

const NewReport = () => {
    const { propertyContext, reportSaved, setreportSaved } = useContext(UserContext);
    const [t, i18n] = useTranslation("global");
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const toast = useRef(null);
    const { reportForm, setReportForm } = useContext(UserContext);
    const resetReportForm = () => {
        setReportForm({
            id: "",
            property: {},
            createdBy: {},
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
            listMalfunctioningCameras: "",
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
            evidences: []
        });
    };

    useEffect(() => {
        const socket = new WebSocket('ws://ec2-52-90-149-16.compute-1.amazonaws.com:8080/ws'); // URL del WebSocket del servidor Spring Boot
    
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
    
          stompClient.subscribe('/topic/receiveMessage', (response) => {
            console.log(response)
            const newMessage = response.body;
            console.log(newMessage)
            setMessages([newMessage]);
            let mensaje = JSON.parse(newMessage)
            console.log(mensaje)
            //toast.current.show({ severity: 'success', summary: 'Evidencia Subida', detail: JSON.parse(newMessage).type, life: 5000 });
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: mensaje.type,
                showConfirmButton: false,
                timer: 5000
            });  
        });
    
          // Aquí puedes enviar cualquier mensaje adicional después de que la conexión esté establecida
          // Ejemplo: stompClient.send('/app/sendMessage', {}, JSON.stringify({ message: 'Hola servidor!' }));
        });
        return () => {
            toast.current = null; // Limpiar la referencia cuando el componente se desmonte
        };
      }, []);

    const validateForm = () => {
  
        const fieldsToValidate = {
            'property.name': t("dashboard.reports.new-report.select-property"),
            'createdBy.name': t("dashboard.reports.new-report.select-user"),
            'numerCase': t("dashboard.reports.new-report.select-number-case"),
            'dateOfReport': t("dashboard.reports.new-report.select-date-of-report"),
            'timeOfReport': t("dashboard.reports.new-report.select-time-of-report"),
            'incidentDate': t("dashboard.reports.new-report.select-date-of-incident"),
            'incidentStartTime': t("dashboard.reports.new-report.select-incident-start-time"),
            'incidentEndTime': t("dashboard.reports.new-report.select-incident-end-time"),
            'caseType.incident': t("dashboard.reports.new-report.select-incident"),
            'level': t("dashboard.reports.new-report.select-report-level"),
            'company': t("dashboard.reports.new-report.select-company"),
            'listMalfunctioningCameras': t("dashboard.reports.new-report.listMalfunctioningCameras"),
            'policeFirstResponderNotified': t("dashboard.reports.new-report.is-policeFirstResponderNotified"),
            'policeFirstResponderScene': t("dashboard.reports.new-report.police-first-responder-scene"),
            'securityGuardsNotified': t("dashboard.reports.new-report.securityGuardsNotified"),
            'securityGuardsScene': t("dashboard.reports.new-report.securityGuardsScene"),
            'policeNumerCase': t("dashboard.reports.new-report.policeNumerCase"),
            'formNotificationClient': t("dashboard.reports.new-report.NotificationClient"),
            'emailedReport': t("dashboard.reports.new-report.emaildReport"),
            'reportDetails': t("dashboard.reports.new-report.report-details")
        };
        const missingFieldKey = Object.keys(fieldsToValidate).find(field => {
            const fieldParts = field.split('.');
            let value = reportForm;
            for (const part of fieldParts) {
                value = value[part];
                if (value === undefined) return true;
            }
            return value === "" || value === null || (Array.isArray(value) && value.length === 0); 
        }); 

        if (missingFieldKey) {
            const missingFieldName = fieldsToValidate[missingFieldKey];
            Swal.fire({
                title: t("dashboard.reports.new-report.swal.fill-missing-field-title"),
                text: `${t("dashboard.reports.new-report.swal.fill-missing-field")} ${missingFieldName}`,
                icon: 'warning',
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: 'custom-swal2-confirm'
                },
                buttonsStyling: false
            });
            return false;
        }

        if (reportForm.evidences.length === 0) {
            Swal.fire({
                title: t("dashboard.reports.new-report.swal.missing-evidence-title"),
                text: t("dashboard.reports.new-report.swal.missing-evidence"),
                icon: 'warning',
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: 'custom-swal2-confirm'
                },
                buttonsStyling: false
            });
            return false;
        }

        return true;
    };

    const { property, createdBy, dateOfReport, timeOfReport, incidentDate, incidentStartTime, incidentEndTime, caseType, level, company, numerCase, camerasFunctioning, listMalfunctioningCameras, observerdViaCameras, policeFirstResponderNotified, policeFirstResponderScene, securityGuardsNotified, securityGuardsScene, policeNumerCase, reportDetails, formNotificationClient, emailedReport, pdf, evidences } = reportForm;
    const [properties, setProperties] = useState([]);
    const [Users, setUsers] = useState([])
    const [incidents, setIncidents] = useState([]);
    const levels = ["1", "2", "3", "4"];
    const team = ["Innova Monitoring", "Impro",];
    let user = JSON.parse(localStorage.getItem("user"));
    let userRole = user.role.rolName;

    const fileAlreadyExists = (newFile, existingFiles) => {
        return existingFiles.some(file =>
            file.name === newFile.name &&
            file.size === newFile.size &&
            file.type === newFile.type
        );
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        processFiles(files);
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        processFiles(files);
    };

    const processFiles = (files) => {
        const fileObjects = Array.from(files).reduce((acc, file) => {
            if (!fileAlreadyExists(file, reportForm.evidences)) {
                acc.push({
                    id: Date.now() + file.name,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    file: file,  
                    url: URL.createObjectURL(file)
                });
            }
            return acc;
        }, []);

        if (fileObjects.length > 0) {
            setReportForm(prev => ({
                ...prev,
                evidences: [...prev.evidences, ...fileObjects]
            }));
        }
    };

    const handleFileRemove = (fileIdToRemove, fileUrl) => {
        URL.revokeObjectURL(fileUrl); 
        setReportForm(prev => ({
            ...prev,
            evidences: prev.evidences.filter(file => file.id !== fileIdToRemove)
        }));
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: t('falta la traducción esta sera la ruta: dashboard.reports.new-report.evidence-removed'),
            showConfirmButton: false,
            timer: 3000
        });
    };

    useEffect(() => {
        const fetchProperties = async () => {
            const propertiesData = await getPropertiesInfo(navigate);
            setProperties(propertiesData);
        };

        fetchProperties();
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            let usersData = await getAdminsAndMonitors();
            console.log("Users Data:", usersData); 
            const formattedUsers = usersData.map(user => ({
                label: user.name,
                value: user
            }));
            setUsers(formattedUsers);
            if (userRole === "Monitor") {
                const monitorUser = formattedUsers.find(u => u.value.id === user.id)?.value;
                if (monitorUser) {
                    setReportForm(prev => ({
                        ...prev,
                        createdBy: monitorUser                     }));
                }
            }
        };

        fetchUsers();
    }, [ userRole, user.id, setReportForm]);

    console.log("EditReport data:", reportForm);

    useEffect(() => {
        const fetchIncidents = async () => {
            const incidentsData = await getIncidents(navigate);
            setIncidents(incidentsData);
        };
        fetchIncidents();
    }, [navigate]);


    const malFunctionCameras = useMemo(() => [
        { label: t("dashboard.reports.new-report.list-Malfuncion-cameras.na"), value: 'N/A' },
        { label: t("dashboard.reports.new-report.list-Malfuncion-cameras.listedOnReport"), value: 'Listed on Report' }
    ], [t]);


    const [listpoliceFirstResponderScene, setlistpoliceFirstResponderScene] = useState([]);
    useEffect(() => {
        setlistpoliceFirstResponderScene([
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.yes"), value: 'Yes' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.no"), value: 'No' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.n/a"), value: 'N/A' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.fiat-security"), value: 'Fiat Security' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.security"), value: 'Security' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.police"), value: 'Police' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.firemen"), value: 'Firemen' },
            { label: t("dashboard.reports.new-report.List-policeFirstResponderNotified.ambulance"), value: 'Ambulance' },
        ]);
    }, [t, i18n.language]);


    const [listNotificationClient, setlistNotificationClient] = useState([]);
    useEffect(() => {
        setlistNotificationClient([
            { label: t("dashboard.reports.new-report.NotificationClient-list.email"), value: 'Email' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.call-mgr"), value: 'Call MGR' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.call-asst-mgr"), value: 'CALL ASST.MGR' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.text"), value: 'Text' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.email-call"), value: 'EMAIL & CALL' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.text-call"), value: 'TEXT & CALL' },
            { label: t("dashboard.reports.new-report.NotificationClient-list.other"), value: 'OTHER' }
        ])
    }, [t, i18n.language]);

    const [listemailedReport, setemailedReport] = useState([]);
    useEffect(() => {
        setemailedReport([
            { label: t("dashboard.reports.new-report.emaildReport-list.property-manager"), value: 'PROPERTY MANAGER' },
            { label: t("dashboard.reports.new-report.emaildReport-list.assitant-manager"), value: 'ASSISTANT MANAGER' },
            { label: t("dashboard.reports.new-report.emaildReport-list.ownership"), value: 'OWNERSHIP' },
            { label: t("dashboard.reports.new-report.emaildReport-list.corporate"), value: 'CORPORATE' },
            { label: t("dashboard.reports.new-report.emaildReport-list.security-guard"), value: 'SECURITY GUARD' },
            { label: t("dashboard.reports.new-report.emaildReport-list.staff"), value: 'STAFF' }
        ])
    }, [t, i18n.language])

    const [headerTitle, setHeaderTitle] = useState('');

    useEffect(() => {
        const updateTitle = () => {
            if (reportForm.property && reportForm.property.name) {
                const newTitleWithProperty = `${t('dashboard.reports.new-report.new-report-with-property')} ${reportForm.property.name}`;
                setHeaderTitle(newTitleWithProperty);
            } else {
                const newTitle = t('dashboard.reports.new-report.new-report');
                setHeaderTitle(newTitle);
            }
        };
        updateTitle();
        i18n.on('languageChanged', updateTitle);
        return () => {
            i18n.off('languageChanged', updateTitle);
        };
    }, [i18n, t, reportForm.property]);

    const sendingreport = () => {
        
        if (!validateForm()) return;

        Swal.fire({
            title: t("dashboard.reports.new-report.swal.confirmation") + (reportForm.property?.name || ' '),
            icon: "info",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="pi pi-check"></i> ' + t("dashboard.reports.new-report.swal.send"),
            denyButtonText: `<i class="pi pi-times"></i> ` + t("dashboard.reports.new-report.swal.don't-save"),
            cancelButtonText: t("dashboard.reports.new-report.swal.cancel"),
            buttonsStyling: false,
            customClass: {
                confirmButton: 'swal2-confirm-button-success',
                denyButton: 'swal2-deny-button',
                cancelButton: 'swal2-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                postReport(reportForm, t);    
                navigate("/dashboard/reports");
                 
            } else if (result.isDenied) {
                resetReportForm();
                Swal.fire({
                    icon: "error",
                    title: t("dashboard.reports.new-report.swal.canceled-report"),
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        });
    };

    return (
        <div className="m-20 md:m-10 mt-14 p-2 md:p-0 bg-white rounded-3xl">
        <Toast ref={toast} />
            <Header title={headerTitle} />
            <div className="flex flex-wrap -mx-3">

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="propertyType" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-property")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-home"></i>
                        </span>
                        <Dropdown
                            value={property}
                            onChange={(e) => {
                                setReportForm(prevForm => ({
                                    ...prevForm,
                                    property: e.value
                                }));
                            }}
                            options={properties}
                            optionLabel="name"
                            placeholder={t("dashboard.reports.new-report.property")}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="userType" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-user")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                        {userRole === "Admin" ? (
                            <Dropdown
                                value={reportForm.createdBy}
                                onChange={(e) => setReportForm(prev => ({
                                    ...prev,
                                    createdBy: e.value // e.value ahora será el objeto de usuario completo
                                }))}
                                options={Users}
                                optionLabel="label"
                                placeholder={t("dashboard.reports.new-report.user")}
                                className="w-full"
                            />
                        ) : (
                            <div className="w-full p-inputtext p-component p-disabled">
                                <span>{user.name}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-number-case")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={numerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, numerCase: e.value };
                        })} placeholder={t("dashboard.reports.new-report.number-case")}
                            mode="decimal" minFractionDigits={0} />

                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="dateOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-date-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.new-report.date-of-report-placeholder")}
                            value={dateOfReport}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, dateOfReport: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="timeOfReport" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-time-of-report")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.new-report.time-of-report-placeholder")}
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
                        {t("dashboard.reports.new-report.select-date-of-incident")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-calendar-times"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.new-report.date-of-incident-placeholder")}
                            value={incidentDate}
                            onChange={(e) => setReportForm((i) => {

                                return { ...reportForm, incidentDate: e.value };
                            })}
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="incidentStartTime" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-incident-start-time")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.new-report.incident-start-time-placeholder")}
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
                        {t("dashboard.reports.new-report.select-incident-end-time")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock"></i>
                        </span>
                        <Calendar
                            placeholder={t("dashboard.reports.new-report.incident-end-time-placeholder")}
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
                        {t("dashboard.reports.new-report.select-incident")}
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
                            placeholder={t("dashboard.reports.new-report.incident")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="level" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-report-level")}
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
                            placeholder={t("dashboard.reports.new-report.level")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="company" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-company")}
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
                            placeholder={t("dashboard.reports.new-report.monitoring-team")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="camerasfunctioning" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-is-cameras-funcioning")}
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
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.new-report.yes")}</label>
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
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.new-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="MalfuncioningCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.listMalfunctioningCameras")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-camera"></i>
                        </span>
                        <Dropdown
                            value={listMalfunctioningCameras}
                            onChange={(e) => setReportForm((prev) => ({
                                ...prev,
                                listMalfunctioningCameras: e.value
                            }))}
                            options={malFunctionCameras}
                            optionLabel="label"
                            placeholder={t("dashboard.reports.new-report.selectMalfunctioningCamerasPlaceholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="observerdViaCameras" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.select-observerdViaCameras")}
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
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.new-report.yes")}</label>
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
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.new-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.is-policeFirstResponderNotified")}
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
                            <label htmlFor="camerasYes" className="ml-2">{t("dashboard.reports.new-report.yes")}</label>
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
                            <label htmlFor="camerasNo" className="ml-2">{t("dashboard.reports.new-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeFirstResponderNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.police-first-responder-scene")}
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
                            placeholder={t("dashboard.reports.new-report.policeFirstResponderSceneeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsNotified" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.securityGuardsNotified")}
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
                            <label htmlFor="securityGuardsNotifiedYes" className="ml-2">{t("dashboard.reports.new-report.yes")}</label>
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
                            <label htmlFor="securityGuardsNotifiedNo" className="ml-2">{t("dashboard.reports.new-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6 text-center">
                    <label htmlFor="GuardsScene" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.securityGuardsScene")}
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
                            <label htmlFor="securityGuardsSceneYes" className="ml-2">{t("dashboard.reports.new-report.yes")}</label>
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
                            <label htmlFor="securityGuardsSceneNo" className="ml-2">{t("dashboard.reports.new-report.no")}</label>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="policeNumerCase" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.policeNumerCase")}
                    </label>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-hashtag"></i>
                        </span>
                        <InputNumber value={policeNumerCase} onValueChange={(e) => setReportForm((i) => {
                            return { ...reportForm, policeNumerCase: e.value };
                        })} placeholder={t("dashboard.reports.new-report.policeNumerCase-placeholder")}
                            mode="decimal" minFractionDigits={0} />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="NotificationClient" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.NotificationClient")}
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
                            placeholder={t("dashboard.reports.new-report.NotificationClient-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full md:w-1/3 px-3 mb-6">
                    <label htmlFor="emaildReport" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.emaildReport")}
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
                            placeholder={t("dashboard.reports.new-report.emaildReport-placeholder")}
                            className="w-full md:w-14rem"
                        />
                    </div>
                </div>

                <div className="w-full px-3 mb-6">
                    <div className="file-upload bg-white p-4 rounded-lg shadow">
                        <input
                            type="file"
                            id="file-input"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                        />
                        <div className="file-select-button mb-3">
                            <label htmlFor="file-input" className="cursor-pointer text-blue-500 flex items-center">
                                <i className="pi pi-plus" style={{ 'fontSize': '1.5em' }}></i> <span className="ml-2">{t("dashboard.reports.new-report.upload-evidences")}</span>
                            </label>
                        </div>
                            <div className="drop-area text-center p-10 bg-blue-100 border-blue-500 border-dashed rounded-lg hover:bg-blue-200"
                                onDragOver={e => e.preventDefault()}
                                onDrop={handleFileDrop}
                                onClick={() => document.getElementById('file-input').click()}  
                            >
                                <i className="pi pi-upload" style={{ 'fontSize': '2em' }}></i>
                            <p>{t("dashboard.reports.new-report.drop-evidences")}</p>
                            </div>
                        <div className="files-list">
                            {reportForm.evidences.map((file, index) => (
                                <div key={index} className="file-item flex items-center justify-between mb-2 bg-gray-100 p-2 rounded">
                                    {file.type.startsWith('image/') && (
                                        <img src={file.url} alt={file.name} className="file-image-preview w-20 h-20 mr-2" />
                                    )}
                                    <div className="file-details flex-grow">
                                        <span className="file-name font-semibold">{file.name}</span>
                                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger margin-delete-button" onClick={() => handleFileRemove(file.id, file.url)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full px-3 mb-6">
                    <label htmlFor="reportDetails" className="font-bold block mb-2">
                        {t("dashboard.reports.new-report.report-details")}
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
                            placeholder={t("dashboard.reports.new-report.report-details-placeholder")}
                        />
                    </div>
                </div>


            </div>

            <div className="flex justify-end mt-4 pr-20">
                <Button label={t("dashboard.reports.new-report.swal.send")} severity="success" onClick={sendingreport} />
            </div>
        </div>

    );
};

export default NewReport;