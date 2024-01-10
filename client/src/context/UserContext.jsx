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
      const res = await registerRequest(user);
      console.log(res.data);
      console.log('Register exitoso')
      setUser(res.data);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrors("Email ya existente")
        console.log("Email existente");
      } else {
        setErrors("Error registrarse")
        console.log("Error al iniciar sesión:", error);
      }
    }
  };

  const signin = async (user) => {
    try {
      const response = await loginRequest(user);
      const userData = response.data.payload;
      setUser(userData);
      setLoggedIn(true);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrors("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.")
        console.log("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
      } else {
        setErrors("Error al iniciar sesión:")
        console.log("Error al iniciar sesión:", error);
      }
      
    }
    
  };

  setTimeout(() => {
    setErrors('');
  }, 6000);

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
