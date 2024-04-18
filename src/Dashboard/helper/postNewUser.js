import { CameraAltTwoTone } from '@mui/icons-material';
import React from 'react'
import Swal from 'sweetalert2';

export const postNewUser = async (user) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/users`;
  const { name, email, image, pasword, rol } = user;  

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        image,
        pasword, 
        rol
      })
    });

    const data = await resp.json();

    if (resp.ok) {
      
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
