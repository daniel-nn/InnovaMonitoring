import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./style.css";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import { FooterDash, NavbarDash } from "./components";
import { UserContext } from "../context/UserContext";
import { useStateContext } from "../context/ContextProvider";
import useFetchProperty from "./Hooks/useFetchProperty";

const Dashboard = () => {
  const { activeMenu } = useStateContext();
  const { propertyContext, setPropertyContext } = useContext(UserContext);
  const navigate = useNavigate();


  const propertyStorage = JSON.parse(localStorage.getItem("propertySelected"));
  const propertyId = propertyStorage.id || 1;
  const { property, isLoading } = useFetchProperty(propertyId, navigate);


  useEffect(() => {
    // Asegúrate de que 'property' no sea null ni undefined antes de intentar usar 'Object.keys'
    if (property && Object.keys(propertyContext).length === 0 && Object.keys(property).length > 0) {
      setPropertyContext(property);
    }
    if (!propertyId) {
      navigate("/");
    }
  }, [property, propertyContext, setPropertyContext, navigate, propertyId]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'user' && !event.newValue) {
        // Si la clave 'user' en localStorage se elimina o se limpia, redirigir a login
        navigate('/login');
      }
    };

    // Agrega el event listener al objeto window
    window.addEventListener('storage', handleStorageChange);

    // Retorna una función de limpieza que remueve el event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  return (
    <div className="flex relative dark:bg-main-dark-bg">
       {/* <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            className="text-3xl  p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div> */}
      {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          <Sidebar />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          <Sidebar />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg  w-full ">
          <NavbarDash />
        </div>
        {/* {themeSettings && (<ThemeSettings />)} */}
        <div>
          <Outlet />
        </div>
        <FooterDash/>
      </div>
    </div>
  );
};

export default Dashboard;