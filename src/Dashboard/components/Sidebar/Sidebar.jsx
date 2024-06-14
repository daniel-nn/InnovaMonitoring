import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { SiShopware } from "react-icons/si";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Logo from "../../../assets/images/Logos/Logo-short.png"
import SidebarLinks from "../../data/sliderbar";
import { useStateContext } from "../../../context/ContextProvider";
import { FiShoppingBag } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import './Siderbar.css'

const Sidebar = () => {
  const { currentColor, activeMenu, setActiveMenu, screenSize } =
    useStateContext();
  let user = JSON.parse(localStorage.getItem("user") || '{}');
  let userRole = user.role.rolName;
  const navigate = useNavigate();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const logout = () => {
    localStorage.setItem("user", JSON.stringify({}));
    localStorage.setItem("propertySelected", JSON.stringify({}));
    navigate("/");
  };

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2 text-lato";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2 text-lato ";

  const links = SidebarLinks();
  const [t, i18n] = useTranslation("global");

  const [showImage, setShowImage] = useState(false);
  const [textVisibility, setTextVisibility] = useState('hidden');

  React.useEffect(() => {
    const animate = () => {
      setShowImage(false);  // Asegura que la imagen esté oculta inicialmente
      setTimeout(() => {
        setShowImage(true); // Activa la animación de la imagen
        setTimeout(() => {
          setShowImage(false); // Desactiva la animación de la imagen
          setTextVisibility(true);  // Activa la animación del texto
        }, 1000); // Tiempo después de que termina la animación de la imagen
      }, 100); // Tiempo antes de iniciar la animación de la imagen
    };

    animate();
    const interval = setInterval(animate, 13000); // Tiempo total del ciclo de animación
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ml-3 h-screen overflow-hidden overflow-y-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-center items-start flex-col w-full">
            
            <div className="flex flex-col justify-center items-center mt-5">
              <img className={`logodash ${showImage ? 'animate-assembleImage' : ''}`} src={Logo} alt="Logo" />
            </div>
            <div className="flex flex-col justify-center items-center mt-5">

              <p className={`typewriter-text-logo animate-typing pt-2 pl-3 text-sm md:text-lg lg:text-xl `} style={{ visibility: textVisibility }}>
                Innova Monitoring LLC
              </p>
</div>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 p-0 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => {
                  if (link.permit === "Yes") {
                    return (
                      <NavLink
                        to={`/dashboard/${link.url}`}
                        key={link.name}
                        onClick={handleCloseSideBar}
                        style={({ isActive }) => ({
                          backgroundColor: isActive ? currentColor :  "",
                        })}
                        className={({ isActive }) =>
                          isActive ? activeLink : normalLink
                        }
                      >
                        {link.icon}
                        <span className="capitalize ">{link.name}</span>
                      </NavLink>
                    );
                  } else {
                    if (userRole === "Admin") {
                      return (
                        <NavLink
                          to={`/dashboard/${link.url}`}
                          key={link.name}
                          onClick={handleCloseSideBar}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : "",
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {link.icon}
                          <span className="capitalize ">{link.name}</span>
                        </NavLink>
                      );
                    } else {
                      return <React.Fragment key={link.name} />;
                    }
                  }

                  return <React.Fragment key={link.name} />;
                })}
              </div>
            ))}

            <div
              
              onClick={logout}
              className="flex cursor-pointer items-center gap-5 pl-4 pt-3  rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2"
            >
              <BiLogOut />
              <span className="capitalize ">{t("dashboard.dashboard-sliderbar.graphical-insights-section.logout")}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;