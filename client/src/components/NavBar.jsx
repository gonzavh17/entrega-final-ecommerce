import React from "react";
import { useAuth } from "../context/UserContext";
import { Link } from "react-router-dom";

function NavBar() {
  const { user } = useAuth();

  return (
    <div>
      <p>NoteBook shop</p>

      <p>{user ? user.first_name : <Link to="/login">Iniciar sesion</Link>}</p>

      {user && (
        <Link to="/cart">
          <p>Ir al carrito</p>
        </Link>
      )}
    </div>
  );
}

export default NavBar;
