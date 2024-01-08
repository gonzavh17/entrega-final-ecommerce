import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { registerRequest } from "../api/auth";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {signup, user, isAuthenticated, errors : registerErrors} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if(isAuthenticated) navigate('/mainDashboard')
  }, [isAuthenticated])
  

  const handleRegister = handleSubmit(async (values) => {
    signup(values)
  })

  return (
    <div>
      <p className="register-title">Register</p>

{/*       {
        registerErrors.map((error, i) => 
          (<div>
            {error}
          </div>)
        )
      } */}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          {...register("first_name", { required: true })}
          placeholder="first name"
        />
        {errors.first_name && <p>Name is required</p>}
        <input
          type="text"
          {...register("last_name", { required: true })}
          placeholder="last name"
        />
        {errors.last_name && <p>Last name is required</p>}
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="email"
        />
        {errors.email && <p>Email is required</p>}
        <input
          type="number"
          {...register("age", { required: true })}
          placeholder="age"
        />
        {errors.age && <p>Age is required</p>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="password"
        />
        {errors.password && <p>Password is required</p>}

        <button type="submit">Register</button>
      </form>

      <Link to="/login">
        <p >Iniciar Sesion</p>
      </Link>
    </div>
  );
}

export default Register;
