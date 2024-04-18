import Swal from 'sweetalert2';

export const getUserRolMonitor = async (navigate) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users`;
    let resp = {}; 
    try {
        resp = await fetch(url);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await resp.json();
        const monitors = data.filter(user => user.rol.rolName === "Monitor")
            .map(user => {
                let userImg = "";
                const link = user.image?.split("/");
                if (link) {
                    const idImg = link[5] || "";
                    userImg = "https://drive.google.com/uc?export=view&id=" + idImg;
                }
                return {
                    ProductImage: userImg,
                    StatusBg: "#8BE78B",
                    Email: user.email,
                    Name: user.name,
                    Rol: user.rol.rolName,
                    user,
                    id: user.id
                };
            });

        console.log("Monitors:", monitors);
        return monitors;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
        if (resp.status === 404) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al buscar la información de el monitor en la base de datos",
            });
            return [];
        }
    }
    
};
