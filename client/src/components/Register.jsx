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
  const { signup, user, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  
  console.log(isAuthenticated)

/*   useEffect(() => {
    if (isAuthenticated) navigate("/mainDashboard");
  }, [isAuthenticated]); */

  if (isAuthenticated) {
    return <Navigate to="/mainDashboard" replace />;
  }

  const handleRegister = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <div>
      <p className="register-title">Register</p>

      {registerErrors && <p style={{ color: "red" }}>{registerErrors}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          {...register("first_name", { required: true })}
          placeholder="First name"
        />
        {errors.first_name && <p>Name is required</p>}
        <input
          type="text"
          {...register("last_name", { required: true })}
          placeholder="Last name"
        />
        {errors.last_name && <p>Last name is required</p>}
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
        />
        {errors.email && <p>Email is required</p>}
        <input
          type="number"
          {...register("age", { required: true })}
          placeholder="Age"
        />
        {errors.age && <p>Age is required</p>}
        <input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        {errors.password && <p>Password is required</p>}
        {/* <input
          type="input"
          {...register("role", { required: true })}
          placeholder="Admin, User, Premium"
        />
        {errors.role && <p>Role is required</p>} */}


        <label>
          Role:
          <select {...register("role", { required: true })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button type="submit">Register</button>
      </form>

      <Link to="/login">
        <p>Iniciar Sesion</p>
      </Link>
    </div>
  );
}

export default Register;
