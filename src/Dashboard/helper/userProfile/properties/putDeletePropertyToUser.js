// putDeletePropertyToUser.js
import Swal from 'sweetalert2';

const putDeletePropertyToUser = async (userId, propertyId, t, setUserData) => {
    const url = `${process.env.REACT_APP_SERVER_IP}/users/${userId}/remover-propiedad`;

    // Confirmación de eliminación
    const result = await Swal.fire({
        title: t("dashboard.user-details.properties.table.delete-assigned-property.confirm-title"),
        text: t("dashboard.user-details.properties.table.delete-assigned-property.confirm-text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: t("dashboard.user-details.properties.table.delete-assigned-property.yes"),
        cancelButtonColor: '#d33',
        cancelButtonText: t('dashboard.user-details.properties.table.delete-assigned-property.no')
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: propertyId })
            });

            const data = await response.json(); // Intenta parsear siempre como JSON

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData,
                    user: {
                        ...prevData.user,
                        properties: prevData.user.properties.filter(p => p.id !== propertyId)
                    }
                }));
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    text: `${t('dashboard.user-details.properties.property-remove')}`,
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000
                });
            } else {
                throw new Error(data.error || "Unknown error occurred");
            }
        } catch (error) {
            console.error('Error al eliminar la propiedad:', error);
            Swal.fire(t('Error!'), error.toString(), 'error');
        }
    };

}
export default putDeletePropertyToUser;

