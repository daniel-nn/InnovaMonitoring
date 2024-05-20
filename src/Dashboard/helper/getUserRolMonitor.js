import Swal from 'sweetalert2';

export const getUserRolMonitor = async (navigate) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users`;
    let resp; 
    try {
        resp = await fetch(url);  
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await resp.json();
        const monitors = data
            .filter(user => user.rol && user.rol.rolName === "Monitor")
            .map(user => {
                // Procesar la imagen para asegurarse de que se maneje correctamente
                const imageUrl = user.image ? `${process.env.REACT_APP_S3_BUCKET_URL}/${user.image}` : 'default-placeholder.png';

                return {
                    id: user.id,
                    Name: user.name,
                    Email: user.email,
                    ImageUrl: imageUrl,
                    Rol: user.rol.rolName,
                    numOfReportsUser: user.numOfReportsUser || 0
                };
            });

        console.log("Filtered Monitors:", monitors);
        return monitors;
    } catch (error) {
        console.error("Error al obtener monitores:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        if (resp && resp.status === 404) {  
            Swal.fire({
                icon: "error",
                title: "HTTP Error 404",
                text: "Error al buscar la información del monitor en la base de datos",
            });
        }
        return []; 
    }
};
