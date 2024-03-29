import Swal from "sweetalert2";

export const getAdminsAndMonitors = async (navigate) => {
    let usersMapped = [];
    const url = `${process.env.REACT_APP_SERVER_IP}/users/admins-monitors`;
    let data = {};
    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            throw new Error('Error fetching data');
        }
        data = await resp.json();

        console.log("Raw data from server:", data);

        usersMapped = data.map((user) => {
            if (user.name && !user.deleted) {
                let userImg = "";
                let link = user.image?.split("/");
                let idImg = link?.[5] ? link[5] : "";
                userImg = idImg ? `https://drive.google.com/uc?export=view&id=${idImg}` : user.image;

                return {
                    id: user.id,
                    name: user.name,
                    ProductImage: userImg,
                    rol: user.rol,
                };
            }
            return undefined;
        }).filter(element => element !== undefined);

    } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.toString(),
        });
    }

    if (!data.length) {
        Swal.fire({
            icon: "info",
            title: "Info",
            text: "No se encontraron usuarios con los roles especificados.",
        });
    }

    console.log("Processed usersMapped:", usersMapped);
    return usersMapped;
};
