// component/UserContext.js
import React, { createContext, useState } from "react";

// Create context
const UserContext = createContext();

// Create provider component
export const UserContextProvider = ({ children }) => {
  const [city, setCity] = useState("London"); // Default city

  return (
    <UserContext.Provider value={{ city, setCity }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
