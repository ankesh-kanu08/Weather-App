import React, { createContext, useState } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [city, setCity] = useState("Gandhinagar, Gujarat, India");

  return (
    <UserContext.Provider value={{ city, setCity }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
