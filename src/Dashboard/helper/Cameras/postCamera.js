import { CameraAltTwoTone } from '@mui/icons-material';
import React from 'react'
import Swal from 'sweetalert2';


const formatDate = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}-${date.getFullYear()}`;
};

export const postCamera = async(cameraForm) => {

  const formData = new FormData();
  const cameraData = {
    name: cameraForm.name,
    brand: cameraForm.brand,
    type: cameraForm.type,
    model: cameraForm.model,
    status: cameraForm.status,
    property: cameraForm.property,
    installedByUs: cameraForm.installedByUs,
    dateInstalled: formatDate(cameraForm.dateInstalled),  
  };

  formData.append("camera", new Blob([JSON.stringify(cameraData)], { type: 'application/json' }));

  if (cameraForm.imageFile) {
    formData.append('img', cameraForm.imageFile);   
  }
  const url = `${process.env.REACT_APP_SERVER_IP}/cameras`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to save the camera.');
    }

    const data = await response.json();
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: "The camera has been created correctly",
    });

    return data;

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.toString(),
    });
  }
}