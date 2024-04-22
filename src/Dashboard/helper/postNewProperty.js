import { CameraAltTwoTone } from "@mui/icons-material";
import React from "react";
import Swal from "sweetalert2";

export const postNewProperty= async (agent, t) => {
  let resp = {};

  const url = `${process.env.REACT_APP_SERVER_IP}/properties`;
  let data = {};
  try {
    resp = await fetch(url, {
      method: "POST",
      body: JSON.stringify(agent),
      headers: {
        "Content-Type": "application/json",
      },
    });
    data = await resp.json();
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: t('dashboard.properties.dialog.swal.added-property'),
      showConfirmButton: false,
      timer: 3000
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error,
    });
  }

  if (resp.status == 500) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error saving the property, check that all fields are filled in and try again.",
    });
    return;
  }

  console.log(data);
  return data;
};
