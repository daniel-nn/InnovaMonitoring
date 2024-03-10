import Swal from "sweetalert2";

export const GetPropertyInfo = async (id, userRole) => {
  const url = `${process.env.REACT_APP_SERVER_IP}/properties/${id}`;

  try {
    const resp = await fetch(url);
    // Verifica si la respuesta es exitosa (status 200-299)
    if (!resp.ok) {
      // Lanzar un error detendrá la ejecución y llevará al bloque catch
      throw new Error(`HTTP status ${resp.status}`);
    }

    const data = await resp.json();

    // Manejar la lógica específica del rol
    const reportsMapped = userRole === "Client"
      ? data.reports?.filter(repo => repo.verified)
      : data.reports;

    // Procesamiento de imágenes y cámaras
    const propertyImage = data.img?.split("/")[5]
      ? `https://drive.google.com/uc?export=view&id=${data.img.split("/")[5]}`
      : '';

    const camerasWorking = data.cameras?.filter(camera => camera.status === "Working");
    const camerasOffline = data.cameras?.filter(camera => camera.status === "Offline");
    const camerasVandalized = data.cameras?.filter(camera => camera.status === "Vandalized");

   
    const dataDto = {
      ...data,
      reportsMapped,
      numCamerasWorking: camerasWorking?.length,
      numCamerasOffline: camerasOffline?.length,
      numCamerasVandalized: camerasVandalized?.length,
      numOfReports: reportsMapped?.length, 
      propertyImage,
    };

    return dataDto;

  } catch (error) {
    console.error("Fetch error: ", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `Ha ocurrido un problema con la petición Fetch: ${error.message}`,
    });
    return null; // Devuelve null o un objeto vacío para indicar que la petición falló
  }
};
