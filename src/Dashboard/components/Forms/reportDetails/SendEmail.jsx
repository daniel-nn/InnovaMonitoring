    import React, { useState } from 'react';
    import { InputText } from 'primereact/inputtext';
    import { InputTextarea } from 'primereact/inputtextarea';
    import { useTranslation } from 'react-i18next';
    import ReactImageGallery from "react-image-gallery";
    import "../../../pages/css/ReportDetails/SendEmail.css";

const SendEmail = ({ incidentType, caseNumber, incidentEnglish, incidentDate, incidentStartTime, images, videos }) => {
        const { t } = useTranslation("global");
        const [showCCO, setShowCCO] = useState(false);
        const [mailData, setMailData] = useState({
            to: '',
            cc: '',
            cco: '',
            subject: '',
            body: ''
        });

        const handleInputChange = (e, field) => {
            setMailData({ ...mailData, [field]: e.target.value });
        };

        return (
            <div className="bg-black p-4 text-white">
                <div className="banner-container">
                    <img src="https://innova-bucket.s3.amazonaws.com/Assets/Banner.png" alt="Banner" />
                </div>
                <div className="text-center my-2">
                    <p className='titulo-header'>Report #{caseNumber} - {incidentType}</p>
                </div>
                <div className="grid grid-cols-1 gap-4 my-4 mx-2">
                    <div className="border border-white p-4">
                        <div className="grid grid-cols-2 gap-4 ml-44">
                            <div>
                                <p className="titulo-header">Case Type:</p>
                                <p>{incidentEnglish}</p>
                            </div>
                            <div>
                                <p className="titulo-header">Number Case:</p>
                                <p>#{caseNumber}</p>
                            </div>
                        </div>
                    </div>
                    <div className="border border-white p-4">
                        <div className="grid grid-cols-2 gap-4 ml-44">
                            <div>
                                <p className="titulo-header">Incident Date:</p>
                                <p>{incidentDate}</p>
                            </div>
                            <div>
                                <p className="titulo-header">Incident Time:</p>
                                <p>{incidentStartTime}</p>
                            </div>
                        </div>
                    </div>
                </div>  

                
                <div className="form-container">
                    <div className="input-group">
                        <InputText id="to" value={mailData.to} onChange={(e) => handleInputChange(e, 'to')} placeholder={t("dashboard.reports.send-email.to")} />
                        <span className="cco-link" onClick={() => setShowCCO(!showCCO)}>CCO</span>
                    </div>
                    {showCCO && (
                        <div className="input-group">
                            <InputText id="cco" value={mailData.cco} onChange={(e) => handleInputChange(e, 'cco')} placeholder="CCO" />
                        </div>
                    )}
                    <div className="input-group">
                        <InputText id="cc" value={mailData.cc} onChange={(e) => handleInputChange(e, 'cc')} placeholder={t("dashboard.reports.send-email.cc")} />
                    </div>
                    <div className="input-group">
                        <InputText id="subject" value={mailData.subject} onChange={(e) => handleInputChange(e, 'subject')} placeholder={t("dashboard.reports.send-email.subject")} />
                    </div>
                    <div className="input-group">
                        <InputTextarea id="body" value={mailData.body} onChange={(e) => handleInputChange(e, 'body')} rows={5} autoResize style={{ resize: 'none' }} />
                    </div>
                    <div className="image-gallery-container mt-4">
                        <ReactImageGallery
                            items={images}
                            showNav={false}
                            showPlayButton={false}
                            showFullscreenButton={false}
                        />
                    </div>
                    <div className="flex justify-start mt-2">
                        <p className="titulo-header">Innova Dashboard System</p>
                    </div>
                    <div className="flex justify-end mt-2">
                        <button className="send-button" onClick={() => console.log("enviado")}>
                            {t("dashboard.reports.new-report.swal.send")}
                        </button>
                    </div>
                    
                </div>
            </div>
        );
    };

    export default SendEmail;
