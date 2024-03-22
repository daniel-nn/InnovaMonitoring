export const getNumberOfReportsByRole = async (propertyId, userId, userRole) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/reports/property/${propertyId}/user/${userId}`;
    const headers = new Headers();
    headers.append("Role", userRole);

    try {
        const response = await fetch(url, { headers });
       
        if (response.status === 204) {
            return []; // un array vacío para indicar "sin reportes".
        }
        if (!response.ok) {
            if (response.status === 404) {
                // Un estado 404 significa que simplemente no hay reportes para esta combinación de propiedad y usuario.
                console.log("No se encontraron reportes para esta propiedad y usuario.");
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        } 
        const reports = await response.json();
        return reports; // Devuelve los reportes completos.
    } catch (error) {
        console.error("Fetch error: ", error.message);
        return null;
    }
};
