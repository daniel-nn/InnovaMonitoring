import React from "react";
import Swal from "sweetalert2";

export const getAgents = async (navigate) => {
  let usersMapped = [];
  let userNotDeleted = [];
  let resp = {};
  const url = `${process.env.REACT_APP_SERVER_IP}/agents`;
  let data = {};
  try {
    resp = await fetch(url);
    data = await resp.json();

    console.log("Raw data from server:", data); // Añadido para ver los datos brutos

    usersMapped = data.map((agent) => {
      if (!agent.deleted) {
        if (agent.name) {
          console.log("Processing agent:", agent); // Este log ya estaba
          let agentImg = "";
          let link = agent.image?.split("/");
          let idImg = "";
          if (link) {
            idImg = link[5] ? link[5] : "";
            agentImg = "https://drive.google.com/uc?export=view&id=" + idImg;
          }

          return {
            ProductImage: agentImg || "https://sp-images.summitpost.org/1038746.jpg?auto=format&fit=max&ixlib=php-2.1.1&q=35&w=1024&s=394ed8f3158db7ef966a1b238d293e8b",
            id: agent.id,
            name: agent.name,
            lastName: agent.lastName,
            email: agent.email || "",
            agent,
          };
        }
      }
    });

    usersMapped = usersMapped.filter(function (element) {
      return element !== undefined;
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (resp.status == 404) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al buscar la información de la propiedad en la base de datos",
    });

    navigate("/login");
    return;
  }

  console.log("Processed usersMapped:", usersMapped); // Para ver los datos después de procesar

  return usersMapped;
};
