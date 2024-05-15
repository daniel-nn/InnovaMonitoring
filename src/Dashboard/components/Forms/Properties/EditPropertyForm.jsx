import React, { useContext, useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useTranslation } from "react-i18next";
import { postNewProperty } from "../../../helper/Properties/postNewProperty";
import { UserContext } from "../../../../context/UserContext";
import { putEditProperty } from "../../../helper/Properties/Update/putEditProperty ";
import { putPropertyImage } from "../../../helper/Properties/Update/putPropertyImage";
import '../../../pages/css/Properties/Properties.css'
import Swal from "sweetalert2";

export const EditPropertyForm = ({ property, onClose, refreshProperties }) => {
    const [propertyData, setPropertyData] = useState(property);
    const { propertyProvider, setPropertyProvider } = useContext(UserContext);
    const [validationErrors, setValidationErrors] = useState({});
    const { t } = useTranslation("global");
    const [imgPreview, setImgPreview] = useState('');
    const [mapImgPreview, setMapImgPreview] = useState('');



    useEffect(() => {
    if (property) {
        setPropertyData(property); // Asegúrate de que toda la información de la propiedad está cargada
        const imgURL = property.img ? `${process.env.REACT_APP_S3_BUCKET_URL}/${property.img}` : undefined;
        const mapImgURL = property.mapImg ? `${process.env.REACT_APP_S3_BUCKET_URL}/${property.mapImg}` : undefined;
        setImgPreview(imgURL);
        setMapImgPreview(mapImgURL);
        setPropertyProvider(property);

    }
}, [property]);

    
    const handleInputChange = (event, field) => {
            const value = event.target.value;
            setPropertyData(prev => ({
                ...prev,
                [field]: value
            }));
            if (validationErrors[field] && value.trim()) {
                setValidationErrors(prev => ({
                    ...prev,
                    [field]: null
                }));
            }
        
    };


    const validatePropertyDetails = () => {

        const errors = {};
        const { name, direction, img, mapImg } = propertyProvider;
        if (!name) errors.name = t("dashboard.properties.dialog.swal.validate-property-details.name");
        if (!direction) errors.direction = t("dashboard.properties.dialog.swal.validate-property-details.direction");
        // if (!img || typeof img === 'string' || !img.name) errors.img = t("dashboard.properties.dialog.swal.validate-property-details.img-url");
        // if (!mapImg || typeof mapImg === 'string' || !mapImg.name) errors.mapImg = t("dashboard.properties.dialog.swal.validate-property-details.map-url");


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    
    console.log(propertyProvider)


    
    const handleImageChange = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            // Eliminar el URL anterior si existe
            if (type === 'img' && imgPreview && imgPreview.startsWith('blob:')) {
                URL.revokeObjectURL(imgPreview);
            } else if (type === 'mapImg' && mapImgPreview && mapImgPreview.startsWith('blob:')) {
                URL.revokeObjectURL(mapImgPreview);
            }

            const imageUrl = URL.createObjectURL(file);
            if (type === 'img') {
                setImgPreview(imageUrl);
            } else if (type === 'mapImg') {
                setMapImgPreview(imageUrl);
            }

            setPropertyData(prevState => ({
                ...prevState,
                [type]: file
            }));
        }
    };


    const handleUpdateImages = async () => {
        const formData = new FormData();
        let hasFile = false;

        if (propertyData.img instanceof File) {
            formData.append('img', propertyData.img);
            hasFile = true;
        }
        if (propertyData.mapImg instanceof File) {
            formData.append('map', propertyData.mapImg);
            hasFile = true;
        }


        if (hasFile) {
            const result = await putPropertyImage(property.id, formData, t);
            if (result) {
                onClose(result); 
            }
        } else {
            console.log('No file to update');
            Swal.fire({
                icon: 'warning',
                title: t("dashboard.properties.update.swal.no-image"),
                text: t("dashboard.properties.update.swal.provide-image"),
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'swal-overlay'
                }
            });
        }
    };

    

    const handleUpdateProperty = async () => {
        if (validatePropertyDetails()) {
            try {
                const updatedProperty = await putEditProperty(property.id, propertyData, t);
                console.log('Updated Property:', updatedProperty);
                if (updatedProperty) {
                    onClose(updatedProperty);
                    setPropertyProvider(propertyData);
                    refreshProperties();  
                }
            } catch (error) {
                console.error("Failed to update property info: ", error);
            }
        }
    };

 

    return (
        <div>
            <div className="flex">
                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="name">{t("dashboard.properties.dialog.property-name")}</label>
                    <div className="p-inputgroup">
                        <span className="p-float-label">
                            <InputText
                                id="name"
                                value={propertyData.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </span>
                        {validationErrors.name && <small className="p-error">{validationErrors.name}</small>}
                    </div>
                </div>

                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="direction">{t("dashboard.properties.dialog.address")}</label>
                    <div className="p-inputgroup">
                        <span className="p-float-label">
                            <InputText
                                id="direction"
                                value={propertyData.direction}
                                onChange={(e) => handleInputChange(e, 'direction')}
                            />
                        </span>
                        {validationErrors.direction && <small className="p-error">{validationErrors.direction}</small>}
                    </div>
                </div>
            </div>

            <div className="flex">
                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="img">{t("dashboard.properties.dialog.img-url")}</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="img"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'img')}
                            className="file-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="img" className="file-input-label">{t("dashboard.cameras.dialog.search-img")}</label>
                        {imgPreview && (
                            <div className="image-preview-container mt-3 flex flex-col items-center">
                                <img src={imgPreview} alt="Property Image Preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '10%' }} />
                                <span className="file-name mt-2">{propertyProvider.img ? propertyProvider.img.name : 'No file chosen'}</span>
                            </div>
                        )}
                        {/* {validationErrors.img && <small className="p-error">{validationErrors.img}</small>} */}
                    </div>
                </div>

                <div className="p-inputgroup my-3 ml-3 flex flex-col">
                    <label htmlFor="mapImg">{t("dashboard.properties.dialog.property-map")}</label>
                    <div className="file-upload-container">
                        <input
                            type="file"
                            id="mapImg"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, 'mapImg')}
                            className="file-input"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="mapImg" className="file-input-label">{t("dashboard.cameras.dialog.search-img")}</label>
                        {mapImgPreview && (
                            <div className="image-preview-container mt-3 flex flex-col items-center">
                                <img src={mapImgPreview} alt="Map Image Preview" style={{ maxHeight: '300px', maxWidth: '100%', borderRadius: '10%' }} />
                                <span className="file-name mt-2">{propertyProvider.mapImg ? propertyProvider.mapImg.name : 'No file chosen'}</span>
                            </div>
                        )}
                        {/* {validationErrors.mapImg && <small className="p-error">{validationErrors.mapImg}</small>} */}
                    </div>
                </div>
               
            </div>

            <div className="flex">
                <div className="justify-center">
                    <Button
                        label={t("dashboard.reports.edit-report.update-evidences.button-update-evidences")}
                        icon="pi pi-refresh"
                        className="p-button update-button"
                        onClick={handleUpdateImages}
                    />
                </div>
            </div>

            <div className="flex">
                <div className="w-full flex justify-around mt-5 ">
                    <Button
                        icon="pi pi-times"
                        severity="danger"
                        label={t("dashboard.properties.dialog.cancel")}
                        onClick={onClose}
                    />
                    <div className="w-3"></div>
                    <Button
                        icon="pi pi-check"
                        label={t("dashboard.properties.dialog.send")}
                        className="p-button-success"
                        onClick={handleUpdateProperty}
                    />
                     <Button
                        icon="pi pi-check"
                        label={t("dashboard.properties.dialog.send")}
                        className="p-button-success"
                        onClick={handleUpdateProperty}
                    />
                </div>

            </div>
        </div >

    );
};