import React, { createContext, useContext, useState, useEffect } from "react";

export const ActuContext = createContext();

const ActuProvider = ({ children }) => {
    const [contadorActualizacion, setContadorActualizacion] = useState(0);

    return (
        <ActuContext.Provider value={{ contadorActualizacion, setContadorActualizacion }}>
            {children}
        </ActuContext.Provider>
    );
}

export const useActu = () => useContext(ActuContext);

export default ActuProvider;
