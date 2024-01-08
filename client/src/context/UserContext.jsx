import { createContext, useState, useContext } from "react";
import { registerRequest } from "../api/auth";
import { loginRequest } from "../api/auth";

export const userContext = createContext();

export const useAuth = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useAuth must be used within an UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const signup = async (user) => {
    try {
      console.log(user);
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.log(error.response);
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      console.log(response);
      const userData = response.data.payload; // Ajusta esto según la estructura de tu respuesta de login
      setUser(userData);
      setIsAuthenticated(true);
      setLoggedIn(true);
    } catch (error) {
      console.log("Error while login", error);
    }
  };
  return (
    <userContext.Provider
      value={{
        signup,
        user,
        isAuthenticated,
        errors,
        signin,
        loggedIn
      }}
    >
      {children}
    </userContext.Provider>
  );
};
