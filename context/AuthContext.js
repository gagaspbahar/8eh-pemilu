import React, { useState, useEffect, createContext } from "react";

// const { useState, useEffect } = require("react");
// const { createContext } = require("react");
const jwt = require("jsonwebtoken");


const AuthContext = React.createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeJWT(token);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  }


  const decodeJWT = (token) => {
    // Decode JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        setUser(null);
      } else {
        setUser(decoded);
      }
    });
  }


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };