import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useTranslation } from 'react-i18next';
import ReactImageGallery from "react-image-gallery";
import "../../../pages/css/ReportDetails/SendEmail.css";
import SendEmailComponent from './SendEmailComponent';
import toggleReportVerificationSendingEmail from '../../../helper/ReportDetails/toggleReportVerificationSendingEmail ';
import swal from 'sweetalert2';
const SendEmail = ({
    incidentType,
    caseNumber,
    incidentEnglish,
    incidentDate,
    incidentStartTime,
    images,
    videos,
    propertyName,
    reportId,
    reportVerified,
    updateVerification,
    onHide }) => {

    const { t } = useTranslation("global");
    const [mailData, setMailData] = useState({
        to: '',
        Cc: '',
        subject: `Report #${caseNumber} - ${incidentEnglish} - ${propertyName}`,
        body: ''
    });

    const handleInputChange = (e, field) => {
        setMailData({ ...mailData, [field]: e.target.value });
    };


    const handleEmailSent = async () => {
        if (!mailData.to.trim() && !mailData.Cc.trim()) {
            swal.fire({
                icon: 'warning',
                toast: true,
                text: t("dashboard.reports.case-details.send-email-form.verified-send"),
                timer: 3000,
                position: 'top-end',
                showConfirmButton: false,
                customClass: {
                    container: 'index-swal'
                }

            });
            return;
        }

        await toggleReportVerificationSendingEmail(reportId, !reportVerified, !reportVerified, t);
        updateVerification(true);
        onHide();
    };

    return (
        <div className="fondo-body-send-email p-4 text-white">
            <div className="banner-container">
                <img src="https://innova-bucket.s3.amazonaws.com/Assets/Banner.png" alt="Banner" />
            </div>
            <div className="text-center my-2">
                <p className='titulo-header'>{t("dashboard.reports.case-details.send-email-form.report")} #{caseNumber} - {incidentType} - {t("dashboard.reports.case-details.send-email-form.of")} {propertyName}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 my-4 mx-2">
                <div className="border border-white p-4">
                    <div className="grid grid-cols-2 gap-4 ml-44">
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.case-type")}</p>
                            <p>{incidentEnglish}</p>
                        </div>
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.number-case")}</p>
                            <p>#{caseNumber}</p>
                        </div>
                    </div>
                </div>
                <div className="border border-white p-4">
                    <div className="grid grid-cols-2 gap-4 ml-44">
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.incident-date")}</p>
                            <p>{incidentDate}</p>
                        </div>
                        <div>
                            <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.incident-time")}</p>
                            <p>{incidentStartTime}</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="form-container">
                <div className="input-group">
                    <InputText id="to" value={mailData.to} onChange={(e) => handleInputChange(e, 'to')} placeholder={t("dashboard.reports.case-details.send-email-form.to")} />
                </div>

                <div className="input-group">
                    <InputText id="Cc" value={mailData.Cc} onChange={(e) => handleInputChange(e, 'Cc')} placeholder="CC" />
                </div>
                <div className="input-group">
                    <InputText id="subject" value={mailData.subject} onChange={(e) => handleInputChange(e, 'subject')} placeholder={t("dashboard.reports.case-details.send-email-form.subject")} />
                </div>
                <div className="input-group">
                    <InputTextarea id="body" value={mailData.body} onChange={(e) => handleInputChange(e, 'body')} rows={5} autoResize style={{ resize: 'none' }} />
                </div>
                <div className="image-gallery-container mt-10">
                    <div className="flex justify-center mt-2 p-5">
                        <p className="titulo-images-videos">{ }</p>
                    </div>
                    <ReactImageGallery
                        items={images}
                        showNav={false}
                        showPlayButton={false}
                        showFullscreenButton={false}
                    />
                </div>

                <div className="video-gallery-container mt-10">
                    <div className="flex justify-center mt-2 p-5">
                        <p className="titulo-header">Videos</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {videos?.map((video, index) => (
                            <div key={index} className="flex flex-col items-center w-auto">
                                <video controls width="300">
                                    <source src={video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center mt-2">
                    <p className="titulo-header">{t("dashboard.reports.case-details.send-email-form.ids")}{/* Innova Dashboard System */}</p>
                </div>
                <div className="flex justify-center mt-2">
                    <p className="text-footer">{t("dashboard.reports.case-details.send-email-form.promo")}{/* This incident report is now available on our IDS Dashboard. Do you already have your subscription? */}</p>
                </div>
                <div className="flex justify-end mt-2">
                    {mailData.to.trim() || mailData.Cc.trim() ? (
                        <SendEmailComponent
                            emailTo={mailData.to}
                            Cc={mailData.Cc}
                            subject={mailData.subject}
                            message={mailData.body}
                            images={images}
                            videos={videos}
                            numberCase={caseNumber}
                            incident={incidentEnglish}
                            date={incidentDate}
                            hour={incidentStartTime}
                            onEmailSent={handleEmailSent}
                        />
                    ) : (
                            <button className="send-button" onClick={handleEmailSent} >
                            <div className="svg-wrapper-1">
                                <div className="svg-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="none" d="M0 0h24v24H0z"></path>
                                        <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                    </svg>
                                </div>
                            </div>
                            <span>{t("dashboard.cameras.dialog.send")}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
