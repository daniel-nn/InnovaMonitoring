import { InputText } from "primereact/inputtext";
import React, { useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { postCamera } from "../../../helper/postCamera";
import { MdScreenRotationAlt } from "react-icons/md";
import { BsArrowRightShort, BsArrowUpShort } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export const CameraForm = ({ properties }) => {
  const navigate = useNavigate();
  const { cameraForm, setCameraForm } = useContext(UserContext);
  const {
    name,
    brand,
    installedByUs,
    dateInstalled,
    imageFile,
    status,
    type,
    property,
    model,
    // lon,
    // lat,
    // rotation,
  } = cameraForm;
  const statusList = ["Working", "Offline", "Vandalized"];
  const { t, i18n } = useTranslation("global");


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCameraForm(prevState => ({
        ...prevState,
        imageFile: file
      }));
    }
  };

  return (
    <div>
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.camera-name")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={name}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, name: e.target.value };
                })
              }
              placeholder={t("dashboard.cameras.dialog.camera-name-placeholder")}
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.brand")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={brand}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, brand: e.target.value };
                })
              }
              placeholder={t("dashboard.cameras.dialog.brand-placeholder")}
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.type")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <Dropdown
              value={type}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, type: e.value };
                })
              }
              options={["Dome", "PTZ", "Bullet", "LPR"]}
              placeholder={t("dashboard.cameras.dialog.type-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
        </div>

        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.model")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={model}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, model: e.target.value };
                })
              }
              placeholder={t("dashboard.cameras.dialog.model-placeholder")}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.camera-status")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>

            <Dropdown
              value={status}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, status: e.value };
                })
              }
              options={statusList}
              placeholder={t("dashboard.cameras.dialog.camera-status-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.installed-by")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>

            <Dropdown
              value={installedByUs}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, installedByUs: e.value };
                })
              }
              options={["Yes", "No"]}
              placeholder={t("dashboard.cameras.dialog.installed-by-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
        </div>
              
      </div>
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.date-installed")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-clock"></i>
            </span>
            <Calendar
              placeholder={t("dashboard.cameras.dialog.date-installed-placeholder")}
              value={dateInstalled}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, dateInstalled: e.value };
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">{t("dashboard.cameras.dialog.property")}</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <Dropdown
              value={property}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, property: e.value };
                })
              }
              options={properties}
              optionLabel="name"
              placeholder={t("dashboard.cameras.dialog.property-placeholder")}
              className="w-full md:w-14rem"
            />
          </div>
        </div>

        <div className="mb-6 mx-auto w-7/12">
          <label htmlFor="image">{t("dashboard.cameras.dialog.image")}</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="image" className="file-input-label">{t("dashboard.cameras.dialog.search-img")}</label>
            <span id="file-name" className="file-name">{cameraForm.imageFile ? cameraForm.imageFile.name : ''}</span>
          </div>
        </div>
      
      </div>

      {/* <div className="flex">
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Latitud</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <BsArrowUpShort></BsArrowUpShort>
            </span>

            <InputText
              value={lat}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, lat: e.target.value };
                })
              }
              placeholder="Lat"
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Longitud</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <BsArrowRightShort />
            </span>

            <InputText
              value={lon}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, lon: e.target.value };
                })
              }
              placeholder="Lng"
            />
          </div>
        </div>
        <div className="p-inputgroup my-3 ml-3 flex flex-col">
          <label htmlFor="username">Rotation</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <MdScreenRotationAlt />
            </span>
            <InputText
              value={rotation}
              onChange={(e) =>
                setCameraForm((i) => {
                  return { ...cameraForm, rotation: e.target.value };
                })
              }
              placeholder="Rotation"
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export const CameraFormFooter = ({
  cameraSaved,
  setCameratSaved,
  setCameraFormFlag,
  onClose
}) => {
  const { cameraForm, setCameraForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSaveCamera = async () => {
    await postCamera(cameraForm, navigate);
    setCameratSaved(!cameraSaved);
    setCameraFormFlag(false);
    setCameraForm({})
  };

  return (
    <div className="w-full flex justify-end">
      <Button icon="pi pi-times" severity="danger" label="Cancel" onClick={onClose} />
      <div className="w-3"></div>
      <Button icon="pi pi-check" label="Send" onClick={handleSaveCamera} />
    </div>
  );
};
