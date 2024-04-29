import { CameraAltTwoTone } from '@mui/icons-material';
import React from 'react'
import Swal from 'sweetalert2';

export const postNewUser = async (formData) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/users`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      body: formData  
    });

    const data = await resp.json();

    if (resp.ok) {  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User successfully saved.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Error saving the user, check that all fields are filled in and try again.',
      });
      console.error("Error en la respuesta:", data);
    }

    return data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
    console.error("Error al enviar datos:", error);
    return null;
  }
};
