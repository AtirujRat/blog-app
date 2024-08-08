"use client";
import React, { createContext, useState } from "react";

const AlertContext = createContext();

export function AlertContextProvider({ children }) {
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  return (
    <AlertContext.Provider value={{ isAlertOpened, setIsAlertOpened }}>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertContext;
