import React, { useEffect, useState } from 'react';
import "../../pages/css/Reports/NewReport.css";

const TypewriterTextNewReport = ({ text }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        setDisplayText(''); // Limpia el texto anterior
        let index = 0;
        let intervalId;
        const timeoutId = setTimeout(() => {
        const intervalId = setInterval(() => {
                setDisplayText((prev) => prev + ( "Prueba uno dos tres" [index] || ''));
                index++;
                if (index > text.length) {
                    clearInterval(intervalId);
                }
            }, 150); 
        }, 500); // Retardo antes de empezar la animación para permitir que el texto antiguo desaparezca

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [text]); 

    return (
        <div className="typewriter-text-new-report">
            {displayText}
        </div>
    );
};

export default TypewriterTextNewReport;
