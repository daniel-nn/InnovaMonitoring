import Swal from "sweetalert2";

const getUserAssignedProperties = async (id) => {
    if (!id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se ha proporcionado un ID de usuario válido",
        });
        return;
    }

    const url = `${process.env.REACT_APP_SERVER_IP}/properties/asigned/${id}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching assigned properties:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Failed to fetch assigned properties for user ID ${id}: ${error.message || error.toString()}. Please try again later.`
        });
        return;
    }
};

export { getUserAssignedProperties };
