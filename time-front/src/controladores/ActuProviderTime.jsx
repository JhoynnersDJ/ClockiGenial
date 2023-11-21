import React, { createContext, useContext, useState, useEffect } from "react";

export const ActuTimeContext = createContext();

const ActuTimeProvider = ({ children }) => {

    const [contadorActualizacionTime, setContadorActualizacionTime] = useState(0);

    return (
        <ActuTimeContext.Provider value={{ contadorActualizacionTime, setContadorActualizacionTime }}>
            {children}
        </ActuTimeContext.Provider>
    );
}

export const useActuTime = () => useContext(ActuTimeContext);

export default ActuTimeProvider;