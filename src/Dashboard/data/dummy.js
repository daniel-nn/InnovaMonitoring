import React, { useContext, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AiFillFilePdf, AiFillEdit, AiFillCheckCircle } from "react-icons/ai";
import { FiCreditCard, FiStar, FiShoppingCart, } from "react-icons/fi";
import { FaSpinner } from 'react-icons/fa';
import { BsCurrencyDollar, BsShield, BsChatLeft, } from "react-icons/bs";
import { HiOutlineEye, HiStatusOffline, HiStatusOnline, } from "react-icons/hi";
import { TiDeleteOutline, TiTick } from "react-icons/ti";
import { GiPoliceCar } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import avatar from "./avatar.jpg";
import avatar2 from "./avatar2.jpg";
import avatar3 from "./avatar3.png";
import avatar4 from "./avatar4.jpg";
import product1 from "./product1.jpg";
import product2 from "./product2.jpg";
import product3 from "./product3.jpg";
import product4 from "./product4.jpg";
import product5 from "./product5.jpg";
import product6 from "./product6.jpg";
import product7 from "./product7.jpg";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { TbDeviceCctv } from "react-icons/tb";
import { MdDelete, MdOutlineAddCircleOutline } from "react-icons/md";
import { deleteCamera, deleteItem, deleteProperty, } from "../helper/delete";
import Swal from "sweetalert2";
import { SiDialogflow } from "react-icons/si";
import { postNewAgent } from "../helper/postNewAgent";
import { postIncident } from "../helper/postIncident";
import { toggleReportVerification } from "../helper/toggleReportVerification";
import exportPDF from "../helper/exportPdf";
import deleteReport from "../helper/Reports/delete/deleteReport";
import { t } from "i18next";
import { putAddPropertyUser } from "../helper/userProfile/properties/putAddPropertyUser";
import putDeletePropertyToUser from "../helper/userProfile/properties/putDeletePropertyToUser";

export const useGlobalTranslation = () => {
  return useTranslation("global");
};

export const gridUserImage = ({ UserImage }) => {

  return (
    <div>
      <img
        className="rounded-xl w-20 h-20  md:ml-3"
        src={UserImage}
        alt="order-item"
      />
    </div>
  )
};


export const gridOrderImage = ({ evidences }) => {
  const srcNoImage = `${process.env.REACT_APP_S3_BUCKET_URL}/Resources/NoImage.png`;

  if (!evidences || evidences.length === 0 || !evidences[0]) {
    return (
      <div>
        <img
          className="rounded-xl w-20 h-20 md:ml-3"
          src={srcNoImage}
          alt="No evidence"
        />
      </div>
    );
  }

  const imgEvidence = `${process.env.REACT_APP_S3_BUCKET_URL}/${evidences[0].path}`;

  return (
    <div>
      <img
        className="rounded-xl w-20 h-20 md:ml-3"
        src={imgEvidence}
        alt="order-item"
        style={{ borderRadius: '10%' }}
      />
    </div>
  );
};


export const GridPropertyImage = ({ propertyImage }) => {
  const imageUrl = propertyImage || "default-placeholder.png";
  return (
    <div>
      <img
        className="rounded-xl w-20 h-20 md:ml-3"
        src={imageUrl}
        alt="Property Image"
      />
    </div>
  );
};

export const gridOrderProperties = (props) => {
  return (
    <a className="flex justify-center m-0 p-0 cursor-pointer">
      Detalles
    </a>
  );
};
/*export const gridOrderProperties = (props) => {

  if (props.lenght > 3) {
    return (
      <ol>
        {props?.map((i) => {
          (
            <li> {i.name}</li>
          )
        })}
      </ol>)

  } else {
    return (
      <li className="flex justify-center m-0 p-0 cursor-pointer">
        <SiDialogflow onClick={() => {


          let propertiesList = []
          console.log(props.user)
          console.log(props.user.properties)
          propertiesList = props.user.properties?.map(property => (`<li>${property.name}</li>`))
          console.log(propertiesList)
          Swal.fire({
            title: '<strong>Properties</strong>',
            icon: 'success',
            html:
              '<h1 class=""></h1>' +
              propertiesList

          })
        }}></SiDialogflow>
      </li>
    );

  }

};
*/
export const GridPdf = (props) => {
  const { t } = useGlobalTranslation();

  const handlePDFClick = async () => {
    if (!props.id) {
      Swal.fire(t("dashboard.reports.table.admin.no-pdf"));
    } else {
      console.log("Esto es la data del PDF:", props);
      try {
        await exportPDF(props);
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

export const GridDetails = (props) => {
  let id = props?.id;
  return (
    <Link
      className="flex justify-center m-0 p-0"
      to={`/dashboard/report-details/${id}`}
    >
      <HiOutlineEye className="text-lg "></HiOutlineEye>
    </Link>
  );
};

export const GridIsVerified = ({ verified }) => {
  if (verified) {
    return (
      <div className="flex justify-center m-0 p-0 text-lg text-green-600">
        <AiFillCheckCircle></AiFillCheckCircle>
      </div>
    );
  } else {
    return (
      <div className="flex justify-center m-0 p-0 text-lg text-red-600">
        <TiDeleteOutline></TiDeleteOutline>
      </div>
    );
  }
};

// Plantilla para mostrar el estado del reporte y actualizar su estado
export const GridisVerifiedAndVerification = ({ id, verified: initialVerified }) => {
  const [t, i18n] = useTranslation("global");
  const [verified, setVerified] = useState(initialVerified);

  useEffect(() => {
    setVerified(initialVerified);
  }, [initialVerified]);
  const handleToggleVerification = async () => {
    const newVerifiedStatus = await toggleReportVerification(id, verified, t);
    setVerified(newVerifiedStatus);
  };


  return (
    <div key={Math.random()} className="flex justify-center m-0 p-0 text-lg cursor-pointer" onClick={handleToggleVerification}>
      {verified ? (
        <AiFillCheckCircle className="text-green-600" />
      ) : (
        <TiDeleteOutline className="text-red-600" />
      )}
    </div>
  );
};


export const GridEditReportTemplate = (props) => {

  const { setReportForm } = useContext(UserContext);
  const navigate = useNavigate();

  const handleEditClick = () => {
    const parseDate = (dateStr) => {
      if (!dateStr) return null;
      const [month, day, year] = dateStr.split('-');
      return new Date(year, month - 1, day);
    };

    const parseTime = (timeStr, dateStr) => {
      if (!timeStr || !dateStr) return null;
      const [hours, minutes] = timeStr.split(':');
      const [month, day, year] = dateStr.split('-');
      return new Date(year, month - 1, day, hours, minutes);
    };

    const formattedProps = {
      ...props,
      dateOfReport: parseDate(props.dateOfReport),
      timeOfReport: parseTime(props.timeOfReport, props.dateOfReport),
      incidentDate: parseDate(props.incidentDate),
      incidentStartTime: parseTime(props.incidentStartTime, props.incidentDate),
      incidentEndTime: parseTime(props.incidentEndTime, props.incidentDate)
    };
    console.log("GridEditReportTemplate props xd  :", props);

    setReportForm(formattedProps);
    navigate('/dashboard/EditReport');
  };

  if (!props || !props.id) {
    return <div className="flex justify-center"><p>No hay datos</p></div>;
  }

  return (
    <div className="flex justify-center m-0 p-0 cursor-pointer" onClick={handleEditClick}>
      <AiFillEdit className="text-lg" />
    </div>
  );
};



const GridEditCamera = ({ camera, setSelectedCamera }) => {

  const showCameraToEdit = () => {
    setSelectedCamera(camera);
  };

  return (
    <div className="cursor-pointer flex justify-center m-0 p-0" onClick={showCameraToEdit}>
      <AiFillEdit className="text-lg" />
    </div>
  );
};

const GridEditProperty = ({ property, handleOpenEditPropertyDialog }) => {
  const handleEditClick = () => {
    if (property) {
      handleOpenEditPropertyDialog(property);
    }
  };

  return (
    <div onClick={handleEditClick} className="cursor-pointer flex justify-center m-0 p-0">
      <AiFillEdit className="text-lg" />
    </div>
  );
};


export const GridEdit = ({ caseType }) => {
  const {
    caseProvider,
    setCaseProvider,
    caseDialog,
    setCaseDialog,
    editCase,
    setEditCase,
  } = useContext(UserContext);

  return (
    <div
      onClick={() => {
        setCaseProvider(caseType);
        setCaseDialog(!caseDialog);
        setEditCase(true);
        console.log(caseType);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};


// export const GridUserEdit = ({ user }) => {
//   const { userProvider, setUserProvider, userDialog, setUserDialog } =
//     useContext(UserContext);

//   return (
//     <div
//       onClick={() => {
//         setUserProvider(user);

//         setUserDialog(!userDialog);
//       }}
//       className="flex justify-center m-0 p-0 cursor-pointer"
//     >
//       <AiFillEdit className="text-lg"></AiFillEdit>
//     </div>
//   );
// };
export const GridAgentEdit = ({ agent }) => {
  const { agentProvider, setagentProvider, agentDialog, setAgentDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setagentProvider(agent);
        console.log(agent);
        setAgentDialog(!agentDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};
export const GridPropertyEdit = ({ property }) => {
  const { propertyProvider, setPropertyProvider, agentDialog, setAgentDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setPropertyProvider(property);

        setAgentDialog(!agentDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};


export const GridDelete = ({ id }) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/users`;
  const navigate = useNavigate();
  const { flag, setFlag } = useContext(UserContext);
  const { t } = useTranslation("global");

  const deleteItemFunction = () => {
    Swal.fire({
      title: t("dashboard.users.delete.confirmTitle"),
      text: t("dashboard.users.delete.confirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: t("dashboard.users.delete.confirmButton"),
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.users.delete.cancel-button')
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(url, id, flag, setFlag)
          .then(() => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: t('dashboard.users.delete.user-removed'),
              showConfirmButton: false,
              timer: 3000
            });
            setFlag(!flag);
          })
          .catch(error => {
            Swal.fire(
              t('Error!'),
              t('dashboard.users.delete.error-deleting-user'),
              'error'
            );
          });
      }
    });
  };


  return (
    <div
      onClick={() => {
        deleteItemFunction()
      }}
      className="flex justify-center m-0 p-0 text-red-700"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};


export const GridDeleteReport = ({ id, refreshReports }) => {
  const { t } = useTranslation("global");

  const handleDelete = async () => {
    const success = await deleteReport(id, t);
    if (success) {
      console.log("se borro reporte", id)
      refreshReports();

    }
  };

  return (
    <div onClick={handleDelete} className="flex justify-center m-0 p-0 text-red-700">
      <MdDelete className="text-lg" />
    </div>
  );
};



export const GridDeleteAgents = ({ agent }) => {
  let url = `${process.env.REACT_APP_SERVER_IP}/agents`;
  const { navigate } = useNavigate();
  const { flag, setFlag } = useContext(UserContext);

  const deleteAgent = async () => {
    agent.deleted = true;
    console.log(agent)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e6c200",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        postNewAgent(agent).then(
        );
        setFlag(!flag)
      }
    });


  }
  return (
    <div
      onClick={() => {
        deleteAgent()
      }}
      className="flex justify-center m-0 p-0 text-red-700"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};


export const GridDeleteCase = ({ caseType }) => {
  const { setreportSaved, reportSaved } = useContext(UserContext);
  const [t] = useTranslation("global");
  let url = `${process.env.REACT_APP_SERVER_IP}/cases`;

  const confirmDeletion = () => {
    Swal.fire({
      title: t('dashboard.cases.table.delete.swal.confirmation'),
      text: t("dashboard.cases.table.delete.swal.delete-case"),
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: t('dashboard.cases.table.delete.swal.yes'),
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.cases.table.delete.swal.no')
    }).then((result) => {
      if (result.isConfirmed) {
        deleteIncident();
      }
    });
  };

  const deleteIncident = async () => {
    caseType.deleted = true;
    try {
      await postIncident(caseType, setreportSaved, reportSaved);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: t('dashboard.cases.table.delete.swal.case-removed'),
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire(
        'Error!',
        t('dashboard.cases.table.delete.swal.error-deleting-case'),
        'error'
      );
    }
  }

  return (
    <div
      onClick={confirmDeletion}
      className="flex justify-center m-0 p-0 text-red-700 cursor-pointer"
    >
      <MdDelete className="text-lg" />
    </div>
  );
};

export const GridDeleteProperty = ({ property }) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/properties/${property.id}`;
  const { setFlag } = useContext(UserContext);
  const [t, i18n] = useTranslation("global");
  const confirmDeletion = () => {
    Swal.fire({
      title: t('dashboard.properties.table.delete.swal.confirmation'),
      text: t("dashboard.properties.table.delete.swal.delete-property"),
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: t('dashboard.properties.table.delete.swal.yes'),
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: t('dashboard.properties.table.delete.swal.no')
    }).then((result) => {
      if (result.isConfirmed) {
       
        deleteProperty();
      }
    });
  };

  const deleteProperty = async () => {
    try {
      
      const response = await fetch(url, { method: 'DELETE' });
      if (response.ok) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: t('dashboard.properties.table.delete.swal.property-removed'),
          showConfirmButton: false,
          timer: 3000
        }).then(() => {
          setFlag(flag => !flag); // Solo actualiza el flag cuando el modal se cierra, minimizando re-renderizaciones
        });
      } else {
        throw new Error('Failed to delete the property');
      }
    } catch (error) {
      Swal.fire(
        'Error!',
        'Hubo un problema al eliminar la propiedad.',
        'error'
      );
    }
  };

  return (
    <div onClick={confirmDeletion} className="flex justify-center m-0 p-0 text-red-700">
      <MdDelete className="text-lg" />
    </div>
  );
};

export const GridDeleteCamera = ({ id }) => {
  let url = `${process.env.REACT_APP_SERVER_IP}/cameras`;
  const { cameraSaved, setCameraSaved } = useContext(UserContext);
  const [t, i18n] = useTranslation("global");

  const deleteCameraFunction = () => {

    Swal.fire({
      title: t("dashboard.cameras.table.delete.confirm-title"),
      text: t("dashboard.cameras.table.delete.confirm-text"),
      icon: "warning",
      confirmButtonColor: "#e6c200",
      confirmButtonText: t("dashboard.cameras.table.delete.yes"),
      showCancelButton: true,
      cancelButtonColor: "gray",
      cancelButtonText: t("dashboard.cameras.table.delete.no"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCamera(url, id, cameraSaved, setCameraSaved, t).then(

        );
      }
    });
  }
  return (
    <div
      onClick={() => {
        deleteCameraFunction()
      }}
      className="flex justify-center m-0 p-0 text-red-700"
    >
      <MdDelete className="text-lg "></MdDelete>
    </div>
  );
};

export const GridLiveView = ({ camera }) => {
  // console.log(LiveView);
  const { cameraContext, setCameraContext } = useContext(UserContext);

  return (
    <Link
      className="flex justify-center m-0 p-0"
      onClick={() => {
        setCameraContext(camera);
      }}
      to={`/dashboard/camera/live-view`}
    >
      <HiOutlineEye className="text-lg"></HiOutlineEye>
    </Link>
  );
};

export const gridOrderStatus = (props) => (
  <button
    type="button"
    style={{ background: props.StatusBg }}
    className="text-white py-1 px-2 capitalize rounded-2xl text-md"
  >
    {props.status}
  </button>
);

export const kanbanGrid = [
  { headerText: "To Do", keyField: "Open", allowToggle: true },

  { headerText: "In Progress", keyField: "InProgress", allowToggle: true },

  {
    headerText: "Testing",
    keyField: "Testing",
    allowToggle: true,
    isExpanded: false,
  },

  { headerText: "Done", keyField: "Close", allowToggle: true },
];


const gridCameraimage = (props) => {
  const imageURL = `${process.env.REACT_APP_S3_BUCKET_URL}/${props.image}`;
  return (
    <div className="flex items-center gap-2">

      <img
        className="rounded-sm w-full h-full object-cover"
        src={imageURL}
        alt="employee"
        style={{ borderRadius: '10%' }}
      />

    </div>
  );
};

const gridEmployeeCountry = (props) => (
  <div className="flex items-center justify-center gap-2">
    <GrLocation />
    <span>{props.Country}</span>
  </div>
);

const customerGridImage = (props) => (
  <div className="image flex gap-4">
    <img
      className="rounded-full w-10 h-10"
      src={props.CustomerImage}
      alt="employee"
    />
    <div>
      <p>{props.CustomerName}</p>
      <p>{props.CustomerEmail}</p>
    </div>
  </div>
);

const customerGridStatus = (props) => (
  <div className="flex gap-2 justify-center items-center text-gray-700 capitalize">
    <p
      style={{ background: props.StatusBg }}
      className="rounded-full h-3 w-3"
    />
    <p>{props.level}</p>
  </div>
);
export const areaPrimaryXAxis = {
  valueType: "Category",
};

export const areaPrimaryYAxis = {
  labelFormat: "{value}%",
  lineStyle: { width: 0 },
  maximum: 4,
  interval: 1,
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelStyle: { color: "gray" },
};
export const barPrimaryXAxis = {
  valueType: "Category",
  labelPlacement: "OnTicks",
  edgeLabelPlacement: "None",
  labelIntersectAction: "Rotate90",
};
export const barPrimaryYAxis = {
  majorGridLines: { width: 0 },
  majorTickLines: { width: 0 },
  lineStyle: { width: 0 },
};
const areaChartData = [
  { month: "Jan", sales: 35 },
  { month: "Feb", sales: 28 },
  { month: "Mar", sales: 34 },
  { month: "Apr", sales: 32 },
  { month: "May", sales: 40 },
  { month: "Jun", sales: 32 },
  { month: "Jul", sales: 35 },
  { month: "Aug", sales: 55 },
  { month: "Sep", sales: 38 },
  { month: "Oct", sales: 30 },
  { month: "Nov", sales: 25 },
  { month: "Dec", sales: 32 },
];

export const areaCustomSeries = [
  {
    dataSource: areaChartData,
    xName: "x",
    yName: "y",
    name: "Level 1",
    opacity: "0.8",
    type: "SplineArea",
    width: "2",
  },
];

export const barChartData = [
  [
    { x: "Selling", y: 38 },
    { x: "Towing", y: 38 },
    { x: "Illegal", y: 40 },
    { x: "Garbage", y: 20 },
    { x: "Debriass", y: 7 },
    { x: "Debr", y: 7 },
  ],
  [
    { x1: "Narcotics ", y: 45 },
    { x1: "Police ", y: 18 },
    { x1: "Debris", y: 44 },
    { x1: "Debriss", y: 44 },
    { x1: "Garbage", y: 17 },
    { x1: "Debri", y: 44 },
  ],
  [
    { x2: "Police Arrest", y: 20 },
    { x2: "Gambling", y: 30 },
    { x2: "Fighting", y: 50 },
    { x2: "Narcotics Selling", y: 50 },
    { x2: "Robbery", y: 50 },
  ],
  [
    { x3: "Fire", y: 15 },
    { x3: "Shooting", y: 5 },
    { x3: "Carrying Weapo", y: 26 },
    { x3: "Fighting", y: 26 },
    { x3: "Stabin", y: 26 },
    { x3: "Thef", y: 26 },
    { x3: "Flooding", y: 26 },
  ],
];

export const barCustomSeries = [
  {
    dataSource: barChartData[0],
    xName: "x",
    yName: "y",
    name: "Level 1",
    type: "Column",
    marker: {
      dataLabel: {
        visible: true,
        position: "Top",
        font: { fontWeight: "600", color: "#ffffff" },
      },
      visible: false,
    },
  },
  {
    dataSource: barChartData[1],
    xName: "x1",
    yName: "y",
    name: "Level 2",
    type: "Column",
    marker: {
      dataLabel: {
        visible: true,
        position: "Top",
        font: { fontWeight: "600", color: "#ffffff" },
      },
    },
  },
  {
    dataSource: barChartData[2],
    xName: "x2",
    yName: "y",
    name: "Level 3",
    type: "Column",
    marker: {
      dataLabel: {
        visible: true,
        position: "Top",
        font: { fontWeight: "600", color: "#ffffff" },
      },
    },
  },
  {
    dataSource: barChartData[3],
    xName: "x3",
    yName: "y",
    name: "Level 4",
    type: "Column",
    marker: {
      dataLabel: {
        visible: true,
        position: "Top",
        font: { fontWeight: "600", color: "#ffffff" },
      },
    },
  },
];
export const colorMappingData = [
  [
    { x: "Jan", y: 6.96 },
    { x: "Feb", y: 8.9 },
    { x: "Mar", y: 12 },
    { x: "Apr", y: 17.5 },
    { x: "May", y: 22.1 },
    { x: "June", y: 25 },
    { x: "July", y: 29.4 },
    { x: "Aug", y: 29.6 },
    { x: "Sep", y: 25.8 },
    { x: "Oct", y: 21.1 },
    { x: "Nov", y: 15.5 },
    { x: "Dec", y: 9.9 },
  ],
  ["#FFFF99"],
  ["#FFA500"],
  ["#FF4040"],
];

export const rangeColorMapping = [
  { label: "1°C to 10°C", start: "1", end: "10", colors: colorMappingData[1] },

  {
    label: "11°C to 20°C",
    start: "11",
    end: "20",
    colors: colorMappingData[2],
  },

  {
    label: "21°C to 30°C",
    start: "21",
    end: "30",
    colors: colorMappingData[3],
  },
];

export const ColorMappingPrimaryXAxis = {
  valueType: "Category",
  majorGridLines: { width: 0 },
  title: "Months",
};

export const ColorMappingPrimaryYAxis = {
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
  labelFormat: "{value}°C",
  title: "Temperature",
};

export const FinancialPrimaryXAxis = {
  valueType: "DateTime",
  minimum: new Date("2016, 12, 31"),
  maximum: new Date("2017, 9, 30"),
  crosshairTooltip: { enable: true },
  majorGridLines: { width: 0 },
};

export const FinancialPrimaryYAxis = {
  title: "Price",
  minimum: 100,
  maximum: 180,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
};

export const LinePrimaryXAxis = {
  valueType: "DateTime",
  labelFormat: "y",
  intervalType: "Years",
  edgeLabelPlacement: "Shift",
  majorGridLines: { width: 0 },
  background: "white",
};

export const LinePrimaryYAxis = {
  labelFormat: "{value}%",
  rangePadding: "None",
  minimum: 0,
  maximum: 100,
  interval: 20,
  lineStyle: { width: 0 },
  majorTickLines: { width: 0 },
  minorTickLines: { width: 0 },
};

export const customersGrid = [
  { type: "checkbox", width: "50" },
  {
    headerText: "Name",
    width: "150",
    template: customerGridImage,
    textAlign: "Center",
  },
  {
    field: "ProjectName",
    headerText: "Project Name",
    width: "150",
    textAlign: "Center",
  },
  {
    field: "Status",
    headerText: "Status",
    width: "130",
    format: "yMd",
    textAlign: "Center",
    template: customerGridStatus,
  },
  {
    field: "Weeks",
    headerText: "Weeks",
    width: "100",
    format: "C2",
    textAlign: "Center",
  },
  {
    field: "Budget",
    headerText: "Budget",
    width: "100",
    format: "yMd",
    textAlign: "Center",
  },

  {
    field: "Location",
    headerText: "Location",
    width: "150",
    textAlign: "Center",
  },

  {
    field: "CustomerID",
    headerText: "Customer ID",
    width: "120",
    textAlign: "Center",
    isPrimaryKey: true,
  },
];

export const cameraGrid = (t) => {
  return [
    {
      headerText: t("dashboard.table.img"),
      width: "115",
      template: gridCameraimage,
      textAlign: "Center",
    },

    { width: "190", field: "Name", headerText: "Name", textAlign: "Center" },
    {
      headerText: "Status",
      width: "110",
      textAlign: "Center",
      template: gridOrderStatus,
    },
    { field: "Title", headerText: "Brand", width: "100", textAlign: "Center" },
    { field: "Type", headerText: "Type", width: "90", textAlign: "Center" },

    {
      field: "Installed",
      headerText: "Installed",
      width: "100",
      textAlign: "Center",
    },

    {
      field: "DateInstalled",
      headerText: "Date",
      width: "110",
      format: "yMd",
      textAlign: "Center",
    },

  ]
}

export const cameraGridAdmin = (t, setSelectedCamera, onClose) => {
  return [
    {
      headerText: t("dashboard.cameras.table.img"),
      width: "115",
      template: gridCameraimage,
      textAlign: "Center",
    },

    {
      headerText: t("dashboard.cameras.table.name"),
      width: "190",
      field: "name",
      textAlign: "Center"
    },
    {
      headerText: t("dashboard.cameras.table.status"),
      width: "110",
      textAlign: "Center",
      template: gridOrderStatus,
    },
    {
      headerText: t("dashboard.cameras.table.brand"),
      field: "brand",
      width: "100",
      textAlign: "Center"
    },
    {
      field: "type ",
      headerText: t("dashboard.cameras.table.type"),
      width: "90",
      textAlign: "Center"
    },

    {
      field: "LiveView",
      headerText: t("dashboard.cameras.table.details"),
      width: "100",
      textAlign: "Center",
      template: props => < GridLiveView camera={props}/>
    },
    {
      field: "camera",
      headerText: t("dashboard.cameras.table.edit"),
      width: "100",
      textAlign: "Center",
      template: props => <GridEditCamera camera={props} setSelectedCamera={setSelectedCamera} />,
    },
    {
      field: "id",
      headerText: t("dashboard.cameras.table.delete.delete"),
      width: "90",
      textAlign: "Center",
      template: GridDeleteCamera,
    },
  ]
}





export const chatData = [
  {
    image: avatar2,
    message: "Freedom Park Apartments",
    desc: "Congratulate him",
    time: "9:08 AM",
  },
  {
    image: avatar3,
    message: "Aswan Apartments",
    desc: "Cordoba Courts",
    time: "11:56 AM",
  },
  {
    image: avatar4,
    message: "Glorieta Gardens",
    desc: "Check your earnings",
    time: "4:39 AM",
  },
  {
    image: avatar,
    message: "Magnolia Park",
    desc: "Assign her new tasks",
    time: "1:12 AM",
  },
];

export const earningData = [
  {
    icon: <TbDeviceCctv />,
    amount: "44",
    percentage: "-4%",
    title: "Total Cameras",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
  {
    icon: <HiStatusOnline />,
    amount: "34",
    percentage: "+23%",
    title: "Cameras Online",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "#8BE78B",
    pcColor: "green-600",
  },
  {
    icon: <HiStatusOffline />,
    amount: "10",
    percentage: "+38%",
    title: "Cameras Offline",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",

    pcColor: "green-600",
  },
  {
    icon: <GiPoliceCar />,
    amount: "125",
    percentage: "-12%",
    title: "Presence of police officers ",
    iconColor: "blue",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
];

export const recentTransactions = [
  {
    icon: <BsCurrencyDollar />,
    amount: "+$350",
    title: "Paypal Transfer",
    desc: "Money Added",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "green-600",
  },
  {
    icon: <BsShield />,
    amount: "-$560",
    desc: "Bill Payment",
    title: "Wallet",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
  },
  {
    icon: <FiCreditCard />,
    amount: "+$350",
    title: "Credit Card",
    desc: "Money reversed",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",

    pcColor: "green-600",
  },
  {
    icon: <TiTick />,
    amount: "+$350",
    title: "Bank Transfer",
    desc: "Money Added",

    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "green-600",
  },
  {
    icon: <BsCurrencyDollar />,
    amount: "-$50",
    percentage: "+38%",
    title: "Refund",
    desc: "Payment Sent",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
  },
];

export const weeklyStats = [
  {
    icon: <FiShoppingCart />,
    amount: "-$560",
    title: "Top Sales",
    desc: "Johnathan Doe",
    iconBg: "#FB9678",
    pcColor: "red-600",
  },
  {
    icon: <FiStar />,
    amount: "-$560",
    title: "Best Seller",
    desc: "MaterialPro Admin",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "red-600",
  },
  {
    icon: <BsChatLeft />,
    amount: "+$560",
    title: "Most Commented",
    desc: "Ample Admin",
    iconBg: "#00C292",
    pcColor: "green-600",
  },
];

export const themeColors = [
  {
    name: "tomato-theme",
    color: "#1A97F5",
  },
  {
    name: "green-theme",
    color: "#03C9D7",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "tomato-theme",
  },
];

export const userProfileData = [
  {
    icon: <BsCurrencyDollar />,
    title: "My Profile",
    desc: "Account Settings",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
  },
];



const useUserProfileData = () => {
  const [t, i18n] = useTranslation("global");

  const userProfileData = [
    {
      icon: <BsCurrencyDollar />,
      title: t("Contact.contact"),
      desc: t("userProfile.accountSettings"),
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
    },
  ];

  return userProfileData;
};
export default useUserProfileData;


// plantilla para los roles de la tabla de usuarios

const roleTemplate = (rowData, t) => {
  return (
    <span>{t(`dashboard.users.table.roles.${rowData.Rol}`)}</span>
  );
};

/*
export const GridUserEdit = ({ user }) => {
  const { userProvider, setUserProvider, userDialog, setUserDialog } =
    useContext(UserContext);

  return (
    <div
      onClick={() => {
        setUserProvider(user);

        setUserDialog(!userDialog);
      }}
      className="flex justify-center m-0 p-0 cursor-pointer"
    >
      <AiFillEdit className="text-lg"></AiFillEdit>
    </div>
  );
};
*/

const PropertiesTemplate = ({ user }) => {

  const [t, i18n] = useTranslation("global");
  const { userProvider, setUserProvider } = useContext(UserContext);
  const handlerClick = () => {
    console.log(user);
    setUserProvider(user);  // Actualiza el contexto con los datos del usuario
    navigate("/dashboard/UserDetails");
  };
  const navigate = useNavigate();
  return (
    <a onClick={() => handlerClick()} className="flex justify-center m-0 p-0 cursor-pointer">
      {t("dashboard.users.table.details")}
    </a>
  );
};

export const userGrid = (t) => {
  return [
    {
      headerText: t("dashboard.users.table.image"),
      template: gridUserImage,
      textAlign: "Center",
      width: "120",
    },
    {
      field: "Name",
      headerText: t("dashboard.users.table.name"),
      width: "170",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "Email",
      headerText: t("dashboard.users.table.email"),
      width: "180",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "Rol",
      headerText: t("dashboard.users.table.rol"),
      width: "100",
      textAlign: "Center",
      template: rowData => roleTemplate(rowData, t),
      editType: "dropdownedit"
    },
    {
      field: "Properties",
      headerText: t("dashboard.users.table.properties"),
      width: "200",
      textAlign: "Center",
      template: PropertiesTemplate,
      //template: gridOrderProperties,
    },
    {
      headerText: t("dashboard.users.table.delete"),
      template: GridDelete,
      textAlign: "Center",
      width: "80",
      field: "id",
    },
  ];
};

export const RemovePropertyToUser = ({ propertyId, userId, setUserData }) => {
  const { t } = useTranslation("global");

  const handleClick = () => {
    putDeletePropertyToUser(userId, propertyId, t, setUserData);
  };


  return (
    <div onClick={handleClick} className="flex justify-center m-0 p-0 text-red-700 cursor-pointer">
      <MdDelete className="text-lg" />
    </div>
  );
};

export const ImgPropertyUsersProfile = (rowData) => {
  const imageURL = `${process.env.REACT_APP_S3_BUCKET_URL}/${rowData.img}`;
  return <img src={imageURL} alt="Property" style={{ width: "100px", height: "auto" }} />;
};

export const propertiesUserGrid = (t, userId, setUserData) => {
  return [

    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },
  ];
};

export const propertiesUserGridAdmin = (t, userId, setUserData) => {
  return [
    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      headerText: t("dashboard.user-details.properties.table.remove"),
      template: (props) => <RemovePropertyToUser propertyId={props.id} userId={userId} setUserData={setUserData} />,
      width: "100",
      textAlign: "Center",
    },
  ];
};

export const AddPropertyIconTemplate = ({ data, userId, t, setUserData, fetchUpdatedProperties }) => {
  const handleClick = async () => {
    const propertyInfo = {
      id: data.id,
      name: data.name,
      direction: data.direction,
      img: data.img,
      mapImg: data.mapImg
    };

    await putAddPropertyUser(userId, [propertyInfo], t, setUserData, fetchUpdatedProperties);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', textAlign: 'center', fontSize: '1.5em', color: '#007ad9' }}>
      <MdOutlineAddCircleOutline />
    </div>
  );
};

export const assignproperties = (t, userId, setUserData, fetchUpdatedProperties) => {


  return [
    {
      headerText: t("dashboard.user-details.properties.table.image"),
      template: ImgPropertyUsersProfile,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.name"),
      field: "name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.user-details.properties.table.address"),
      field: "direction",
      width: "160",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      headerText: t("dashboard.user-details.properties.table.add-property"),
      template: (rowData) => <AddPropertyIconTemplate data={rowData} userId={userId} t={t} setUserData={setUserData} fetchUpdatedProperties={fetchUpdatedProperties} />,
      width: "100",
      textAlign: "Center",
    },
  ];
};

export const userGridAdmin = [
  {
    headerText: "Image",
    template: gridOrderImage,
    textAlign: "Center",
    width: "120",
  },
  {
    headerText: "Name",
    width: "170",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Email",
    width: "180",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Rol",
    width: "100",
    editType: "dropdownedit",
    textAlign: "Center",
  },
  {
    headerText: "Properties",
    width: "200",
    textAlign: "Center",
    template: gridOrderProperties,
  },

  {
    headerText: "Delete",
    template: GridDelete,
    textAlign: "Center",
    width: "80",
    field: "id",
  },
];

export const ordersCases = [
  {
    headerText: "Case ID",
    field: "id",
    textAlign: "Center",
    width: "20",
  },
  {
    headerText: "Case Type",
    field: "incident",
    textAlign: "Center",
    width: "150",
  },
];

export const ordersCasesAdmin = (t) => {
  return [
    {
      headerText: t("dashboard.cases.table.case-type"),
      field: "incident",
      textAlign: "Center",
      width: "150",
    },
    {
      headerText: t("dashboard.cases.table.edit"),
      template: GridEdit,
      textAlign: "Center",
      width: "30",
      field: "caseType",
    },
    {
      headerText: t("dashboard.cases.table.delete.delete"),
      template: GridDeleteCase,
      textAlign: "Center",
      width: "30",
      field: "caseType",
    },
  ];
};



export const orderAgentsAdmin = (t) => {
  return [
    {
      headerText: "Image",
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.agents.table.name"),
      field: "Name",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.agents.table.email"),
      field: "Email",
      textAlign: "Center",
      width: "120",
    },
    {
      field: "Properties",
      headerText: t("dashboard.users.table.properties"),
      width: "200",
      textAlign: "Center",
      template: PropertiesTemplate,
      //template: gridOrderProperties,
    },
    {
      headerText: t("dashboard.agents.table.delete"),
      template: GridDelete,
      textAlign: "Center",
      width: "80",
      field: "id",
    },
  ];
};


export const propertyGrid = (t) => {
  return [
    {
      headerText: t("dashboard.properties.table.image"),
      template: GridPropertyImage,
      textAlign: "Center",
      field: "img",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.name"),
      field: "Name",
      textAlign: "Center",
      width: "140",
    },
    {
      headerText: t("dashboard.properties.table.address"),
      field: "Direction",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.cameras"),
      field: "Cameras",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: t("dashboard.properties.table.reports"),
      field: "Reports",
      textAlign: "Center",
      width: "120",
    },

  ];
};

export const propertyGridAdmin = (t, handleOpenEditPropertyDialog) => {

  return [
    {
      headerText: "Image",
      template: props => props && <GridPropertyImage propertyImage={props.PropertyImage} />,
      textAlign: "Center",
      field: "img",
      width: "120",
    },
    {
      headerText: "name",
      field: "name",
      textAlign: "Center",
      width: "140",
    },
    {
      headerText: "direction",
      field: "direction",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: "cameras",
      field: "cameras",
      textAlign: "Center",
      width: "120",
    },
    {
      headerText: "reports",
      field: "reports",
      textAlign: "Center",
      width: "120",
    },
    {
      field: "property",
      headerText: t("dashboard.cameras.table.edit"),
      width: "100",
      textAlign: "Center",
      template: props => <GridEditProperty property={props} handleOpenEditPropertyDialog={handleOpenEditPropertyDialog} />
    }, 
    

    {
      headerText: "Delete",
      textAlign: "Center",
      template: props => <GridDeleteProperty property={props} />,
      width: "85",
      field: "id",
    },

  ]

};


export const reportsGrid = (t) => {

  return [
    {
      headerText: t("dashboard.reports.table.client.CaseImage"),
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },

    {
      field: "caseType.incident",
      headerText: "Case",
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      field: "level",
      headerText: "Level",
      width: "130",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: "Date Incident",
      width: "130",
      textAlign: "Center",
    },

    {
      field: "timeOfReport",
      headerText: "Time",
      width: "100",
      editType: "dropdownedit",
      textAlign: "Center",
    },

    {
      field: "numerCase",
      headerText: "Report ID",
      width: "110",
      textAlign: "Center",
    },

    {
      field: "PDF",
      headerText: "PDF",
      width: "80",
      textAlign: "Center",
      template: GridPdf,
    },

    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },

  ];

};

export const reportsGridAdmin = (t, refreshReports) => {
  return [
    {
      headerText: t("dashboard.reports.table.admin.CaseImage"),
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin.Case"),
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "createdBy.name",
      headerText: t("dashboard.reports.table.admin.Agent"),
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: t("dashboard.reports.table.admin.CaseLevel"),
      width: "130",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin.DateCase"),
      width: "130",
      textAlign: "Center",
    },

    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin.IdCase"),
      width: "110",
      textAlign: "Center",
    },

    {
      field: "PDF",
      headerText: "Pdf",
      width: "80",
      textAlign: "Center",
      template: GridPdf,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin.CaseVerified"),
      width: "95",
      textAlign: "Center",
      template: GridisVerifiedAndVerification,
    },

    {
      field: "Edit",
      headerText: t("dashboard.reports.table.admin.CaseEdit"),
      width: "80",
      textAlign: "Center",
      template: GridEditReportTemplate,
    },
    {
      field: "Delete",
      headerText: t("dashboard.reports.table.delete-report.delete"),
      width: "80",
      textAlign: "Center",
      template: props => <GridDeleteReport {...props} refreshReports={refreshReports} />,
    },
  ];
};

export const reportsGridNoVerified = (t, refreshReports) => {
  return [
    {
      headerText: t("dashboard.reports.table.admin-no-verfied.property"),
      field: "property.name",
      textAlign: "Center",
      width: "190",
    },
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin-no-verfied.Case"),
      width: "120",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "createdBy.name",
      headerText: t("dashboard.reports.table.admin-no-verfied.Agent"),
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: t("dashboard.reports.table.admin-no-verfied.CaseLevel"),
      width: "90",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin-no-verfied.DateCase"),
      width: "130",
      textAlign: "Center",
    },

    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin-no-verfied.IdCase"),
      width: "110",
      textAlign: "Center",
    },
    {
      field: "PDF",
      headerText: "Pdf",
      width: "40",
      textAlign: "Center",
      template: GridPdf,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin-no-verfied.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin-no-verfied.CaseVerified"),
      width: "120",
      textAlign: "Center",
      template: GridisVerifiedAndVerification,
    },

    {
      field: "Edit",
      headerText: t("dashboard.reports.table.admin-no-verfied.CaseEdit"),
      width: "80",
      textAlign: "Center",
      template: GridEditReportTemplate,
    },

    {
      field: "Delete",
      headerText: t("dashboard.reports.table.delete-report.delete"),
      width: "80",
      textAlign: "Center",
      template: props => <GridDeleteReport {...props} refreshReports={refreshReports} />,
    },
  ];
};



export const reportsGridMonitor = (t) => {
  return [
    {
      headerText: t("dashboard.reports.table.admin.CaseImage"),
      template: gridOrderImage,
      textAlign: "Center",
      width: "120",
    },
    {
      field: "caseType.incident",
      headerText: t("dashboard.reports.table.admin.Case"),
      width: "200",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "level",
      headerText: t("dashboard.reports.table.admin.CaseLevel"),
      width: "130",
      format: "yMd",
      textAlign: "Center",
      template: customerGridStatus,
    },

    {
      field: "dateOfReport",
      headerText: t("dashboard.reports.table.admin.DateCase"),
      width: "130",
      textAlign: "Center",
    },
    {
      field: "timeOfReport",
      headerText: t("dashboard.reports.table.admin.TimeCase"),
      width: "100",
      editType: "dropdownedit",
      textAlign: "Center",
    },
    {
      field: "numerCase",
      headerText: t("dashboard.reports.table.admin.IdCase"),
      width: "110",
      textAlign: "Center",
    },

    {
      field: "PDF",
      headerText: "Pdf",
      width: "80",
      textAlign: "Center",
      template: GridPdf,
    },
    {
      field: "Details",
      headerText: t("dashboard.reports.table.admin.CaseDetails"),
      width: "105",
      textAlign: "Center",
      template: GridDetails,
    },
    {
      field: "verified",
      headerText: t("dashboard.reports.table.admin.CaseVerified"),
      width: "95",
      textAlign: "Center",
      template: GridIsVerified,
    },
  ];
};

export const ordersData = [
  {
    OrderID: 10248,
    CustomerName: "6/10/2023",

    TotalAmount: "21:13",
    OrderItems: "Narcotics Consumption",
    Location: "Report",
    Status: "Level 2",
    StatusBg: "#8BE78B",
    ProductImage: product6,
  },
  {
    OrderID: 345653,
    CustomerName: "6/10/2023",
    TotalAmount: "20:13",
    OrderItems: "Carrying Weapon",
    Location: "Report",
    Status: "Level 4",
    StatusBg: "red",
    ProductImage: product5,
  },
  {
    OrderID: 390457,
    CustomerName: "6/10/2023",
    TotalAmount: "12:13",
    OrderItems: "Debris",
    Location: "Report",
    Status: "Level 1",
    StatusBg: "#8BE78B",
    ProductImage: product7,
  },
  {
    OrderID: 893486,
    CustomerName: "6/9/2023",
    TotalAmount: "22:32",
    OrderItems: "Police Arrest",
    Location: "Report",
    Status: "Level 3",
    StatusBg: "tomato",
    ProductImage: product4,
  },
  {
    OrderID: 748975,
    CustomerName: "6/9/2023",
    TotalAmount: "06:13",
    OrderItems: "Hazardous",
    Location: "Report",
    Status: "Level 4",
    StatusBg: "red",
    ProductImage: product1,
  },
  {
    OrderID: 94757,
    CustomerName: "6/9/2023",
    TotalAmount: 95.99,
    OrderItems: "Garbage",
    Location: "Report",
    Status: "Level 1",
    StatusBg: "#8BE78B",
    ProductImage: product2,
  },
  {
    OrderID: 944895,
    CustomerName: "6/8/2023",
    TotalAmount: 17.99,
    OrderItems: "Damage to property",
    Location: "Report",
    Status: "Level 4",
    StatusBg: "red",
    ProductImage: product3,
  },
  {
    OrderID: 10248,
    CustomerName: "6/10/2023",

    TotalAmount: "21:13",
    OrderItems: "Narcotics Consumption",
    Location: "Report",
    Status: "Level 2",
    StatusBg: "#FEC90F",
    ProductImage: product6,
  },
  {
    OrderID: 345653,
    CustomerName: "6/10/2023",
    TotalAmount: "20:13",
    OrderItems: "Carrying Weapon",
    Location: "Report",
    Status: "Level 4",
    StatusBg: "red",
    ProductImage: product5,
  },
  {
    OrderID: 390457,
    CustomerName: "6/10/2023",
    TotalAmount: "12:13",
    OrderItems: "Debris",
    Location: "Report",
    Status: "Level 1",
    StatusBg: "#8BE78B",
    ProductImage: product7,
  },
  {
    OrderID: 893486,
    CustomerName: "6/9/2023",
    TotalAmount: "22:32",
    OrderItems: "Police Arrest",
    Location: "Report",
    Status: "Level 3",
    StatusBg: "tomato",
    ProductImage: product4,
  },
  {
    OrderID: 748975,
    CustomerName: "6/9/2023",
    TotalAmount: "06:13",
    OrderItems: "Hazardous",
    Location: "Report",
    Status: "Level 4",
    StatusBg: "red",
    ProductImage: product1,
  },
  {
    OrderID: 94757,
    CustomerName: "6/9/2023",
    TotalAmount: 95.99,
    OrderItems: "Garbage",
    Location: "Report",
    Status: "Level 1",
    StatusBg: "#03C9D7",
    ProductImage: product2,
  },
  {
    OrderID: 944895,
    CustomerName: "6/8/2023",
    TotalAmount: 17.99,
    OrderItems: "Damage to property",
    Location: "Report",
    Status: "active",
    StatusBg: "#03C9D7",
    ProductImage: product3,
  },
];

export const scheduleData = [
  {
    Id: 1,
    Subject: "Explosion of Betelgeuse Star",
    Location: "Space Center USA",
    StartTime: "2021-01-10T04:00:00.000Z",
    EndTime: "2021-01-10T05:30:00.000Z",
    CategoryColor: "#1aaa55",
  },
  {
    Id: 2,
    Subject: "Thule Air Crash Report",
    Location: "Newyork City",
    StartTime: "2021-01-11T06:30:00.000Z",
    EndTime: "2021-01-11T08:30:00.000Z",
    CategoryColor: "#357cd2",
  },
  {
    Id: 3,
    Subject: "tomato Moon Eclipse",
    Location: "Space Center USA",
    StartTime: "2021-01-12T04:00:00.000Z",
    EndTime: "2021-01-12T05:30:00.000Z",
    CategoryColor: "#7fa900",
  },
  {
    Id: 4,
    Subject: "Meteor Showers in 2021",
    Location: "Space Center USA",
    StartTime: "2021-01-13T07:30:00.000Z",
    EndTime: "2021-01-13T09:00:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 5,
    Subject: "Milky Way as Melting pot",
    Location: "Space Center USA",
    StartTime: "2021-01-14T06:30:00.000Z",
    EndTime: "2021-01-14T08:30:00.000Z",
    CategoryColor: "#00bdae",
  },
  {
    Id: 6,
    Subject: "Mysteries of Bermuda Triangle",
    Location: "Bermuda",
    StartTime: "2021-01-14T04:00:00.000Z",
    EndTime: "2021-01-14T05:30:00.000Z",
    CategoryColor: "#f57f17",
  },
  {
    Id: 7,
    Subject: "Glaciers and Snowflakes",
    Location: "Himalayas",
    StartTime: "2021-01-15T05:30:00.000Z",
    EndTime: "2021-01-15T07:00:00.000Z",
    CategoryColor: "#1aaa55",
  },
  {
    Id: 8,
    Subject: "Life on Mars",
    Location: "Space Center USA",
    StartTime: "2021-01-16T03:30:00.000Z",
    EndTime: "2021-01-16T04:30:00.000Z",
    CategoryColor: "#357cd2",
  },
  {
    Id: 9,
    Subject: "Alien Civilization",
    Location: "Space Center USA",
    StartTime: "2021-01-18T05:30:00.000Z",
    EndTime: "2021-01-18T07:30:00.000Z",
    CategoryColor: "#7fa900",
  },
  {
    Id: 10,
    Subject: "Wildlife Galleries",
    Location: "Africa",
    StartTime: "2021-01-20T05:30:00.000Z",
    EndTime: "2021-01-20T07:30:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 11,
    Subject: "Best Photography 2021",
    Location: "London",
    StartTime: "2021-01-21T04:00:00.000Z",
    EndTime: "2021-01-21T05:30:00.000Z",
    CategoryColor: "#00bdae",
  },
  {
    Id: 12,
    Subject: "Smarter Puppies",
    Location: "Sweden",
    StartTime: "2021-01-08T04:30:00.000Z",
    EndTime: "2021-01-08T06:00:00.000Z",
    CategoryColor: "#f57f17",
  },
  {
    Id: 13,
    Subject: "Myths of Andromeda Galaxy",
    Location: "Space Center USA",
    StartTime: "2021-01-06T05:00:00.000Z",
    EndTime: "2021-01-06T07:00:00.000Z",
    CategoryColor: "#1aaa55",
  },
  {
    Id: 14,
    Subject: "Aliens vs Humans",
    Location: "Research Center of USA",
    StartTime: "2021-01-05T04:30:00.000Z",
    EndTime: "2021-01-05T06:00:00.000Z",
    CategoryColor: "#357cd2",
  },
  {
    Id: 15,
    Subject: "Facts of Humming Birds",
    Location: "California",
    StartTime: "2021-01-19T04:00:00.000Z",
    EndTime: "2021-01-19T05:30:00.000Z",
    CategoryColor: "#7fa900",
  },
  {
    Id: 16,
    Subject: "Sky Gazers",
    Location: "Alaska",
    StartTime: "2021-01-22T05:30:00.000Z",
    EndTime: "2021-01-22T07:30:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 17,
    Subject: "The Cycle of Seasons",
    Location: "Research Center of USA",
    StartTime: "2021-01-11T00:00:00.000Z",
    EndTime: "2021-01-11T02:00:00.000Z",
    CategoryColor: "#00bdae",
  },
  {
    Id: 18,
    Subject: "Space Galaxies and Planets",
    Location: "Space Center USA",
    StartTime: "2021-01-11T11:30:00.000Z",
    EndTime: "2021-01-11T13:00:00.000Z",
    CategoryColor: "#f57f17",
  },
  {
    Id: 19,
    Subject: "Lifecycle of Bumblebee",
    Location: "San Fransisco",
    StartTime: "2021-01-14T00:30:00.000Z",
    EndTime: "2021-01-14T02:00:00.000Z",
    CategoryColor: "#7fa900",
  },
  {
    Id: 20,
    Subject: "Alien Civilization",
    Location: "Space Center USA",
    StartTime: "2021-01-14T10:30:00.000Z",
    EndTime: "2021-01-14T12:30:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 21,
    Subject: "Alien Civilization",
    Location: "Space Center USA",
    StartTime: "2021-01-10T08:30:00.000Z",
    EndTime: "2021-01-10T10:30:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 22,
    Subject: "The Cycle of Seasons",
    Location: "Research Center of USA",
    StartTime: "2021-01-12T09:00:00.000Z",
    EndTime: "2021-01-12T10:30:00.000Z",
    CategoryColor: "#00bdae",
  },
  {
    Id: 23,
    Subject: "Sky Gazers",
    Location: "Greenland",
    StartTime: "2021-01-15T09:00:00.000Z",
    EndTime: "2021-01-15T10:30:00.000Z",
    CategoryColor: "#ea7a57",
  },
  {
    Id: 24,
    Subject: "Facts of Humming Birds",
    Location: "California",
    StartTime: "2021-01-16T07:00:00.000Z",
    EndTime: "2021-01-16T09:00:00.000Z",
    CategoryColor: "#7fa900",
  },
];

export const lineChartData = [
  [
    { x: new Date(2005, 0, 1), y: 21 },
    { x: new Date(2006, 0, 1), y: 24 },
    { x: new Date(2007, 0, 1), y: 36 },
    { x: new Date(2008, 0, 1), y: 38 },
    { x: new Date(2009, 0, 1), y: 54 },
    { x: new Date(2010, 0, 1), y: 57 },
    { x: new Date(2011, 0, 1), y: 70 },
  ],
  [
    { x: new Date(2005, 0, 1), y: 28 },
    { x: new Date(2006, 0, 1), y: 44 },
    { x: new Date(2007, 0, 1), y: 48 },
    { x: new Date(2008, 0, 1), y: 50 },
    { x: new Date(2009, 0, 1), y: 66 },
    { x: new Date(2010, 0, 1), y: 78 },
    { x: new Date(2011, 0, 1), y: 84 },
  ],

  [
    { x: new Date(2005, 0, 1), y: 10 },
    { x: new Date(2006, 0, 1), y: 20 },
    { x: new Date(2007, 0, 1), y: 30 },
    { x: new Date(2008, 0, 1), y: 39 },
    { x: new Date(2009, 0, 1), y: 50 },
    { x: new Date(2010, 0, 1), y: 70 },
    { x: new Date(2011, 0, 1), y: 100 },
  ],
];

export const dropdownData = [
  {
    Id: "1",
    Time: "March 2021",
  },
  {
    Id: "2",
    Time: "April 2021",
  },
  {
    Id: "3",
    Time: "May 2021",
  },
];

export const contextMenuItems = [
  "AutoFit",
  "AutoFitAll",
  "SortAscending",
  "SortDescending",
  "Copy",
  "Edit",
  "Delete",
  "Save",
  "Cancel",
  "PdfExport",
  "ExcelExport",
  "CsvExport",
  "FirstPage",
  "PrevPage",
  "LastPage",
  "NextPage",
];

export const stackedChartData = [
  {
    x: "01",
    y: 1,
  },
  {
    x: "02",
    y: 2,
  },
  {
    x: "03",
    y: 2,
  },
  {
    x: "04",
    y: 1,
  },
  {
    x: "05",
    y: 1,
  },
  {
    x: "06",
    y: 1,
  },
  {
    x: "07",
    y: 5,
  },
  {
    x: "08",
    y: 5,
  },
  {
    x: "09",
    y: 7,
  },
  {
    x: "10",
    y: 3,
  },
  {
    x: "11",
    y: 3,
  },
  {
    x: "12",
    y: 8,
  },
];
