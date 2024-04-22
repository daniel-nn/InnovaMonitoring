import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const useHandleProfileClick = () => {
    const { userProvider, setUserProvider } = useContext(UserContext);
    const navigate = useNavigate();

    return useCallback(() => {
        console.log("Datos recibidos en handleProfileClick:", userProvider);

        const { id, name, email, password, image, enable, rol, properties } = userProvider || {};

        let missingFields = [];
        // if (!id) missingFields.push('id');
        // if (!name) missingFields.push('name');
        // if (!email) missingFields.push('email');
        // if (!password) missingFields.push('password');
        // if (!image) missingFields.push('image');
        // if (enable === undefined) missingFields.push('enable');
        // if (!rol || !rol.rolName) missingFields.pussh('rol or rol.rolName');

        if (missingFields.length > 0) {
            console.error("Perfil incompleto o incorrecto, faltan los siguientes campos:", missingFields.join(', '));
            return;
        }

        navigate("/dashboard/UserDetails");
    }, [userProvider, navigate]); 
};

export default useHandleProfileClick;
