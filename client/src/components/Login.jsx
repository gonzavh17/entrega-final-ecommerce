import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const {register, handleSubmit, formState: { errors },} = useForm();
  const { signin, loggedIn } = useAuth()

  const handleLogin = async (data) => {
    signin(data)
  };

  if (loggedIn) {
    return <Navigate to="/mainDashboard" replace />;
  }
  return (
    <div>
      <form action="submit" onSubmit={handleSubmit(handleLogin)}>
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="email"
        />
        {errors.email && <p>Email is required</p>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="password"
        />
        {errors.password && <p>password is required</p>}

        <button type="submit">Login</button>
      </form>

      <Link to='/register'><a href="">No tienes cuenta? Ingresa aqui</a></Link>
    </div>
  );
}
