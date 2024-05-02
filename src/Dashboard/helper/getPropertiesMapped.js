import React, { useContext } from "react";
import Swal from "sweetalert2";

export const getPropertiesMapped = async (navigate) => {
  let resp = {};
  let propertyMapped = [];

  const url = `${process.env.REACT_APP_SERVER_IP}/properties`;
  let data = {};
  try {
    resp = await fetch(url);

    data = await resp.json();
    propertyMapped = data.map((property) => {
       
    let image = `${process.env.REACT_APP_S3_BUCKET_URL}/${property?.img || "Resources/NoImage.png"}`

      return {
       id: property.id,
        PropertyImage: image,
        Name: property.name,
        Direction: property.direction,
        Edit: property || {},
        Reports:property.reports?.length || 0,
        Cameras:property.cameras?.length || 0,
        property
      };

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
      text: "Error al buscar la informacion de la propiedad en la base de datos",
    });

    navigate("/login");
    return;
  }

  console.log(propertyMapped);
  return propertyMapped;
};
