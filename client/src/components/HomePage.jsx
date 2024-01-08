import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <p className="home-title">Home Page</p>

      <Link to='/login'>Iniciar Sesion</Link>
      <Link to='/register'>Registrarse</Link>
    </div>
  )
}

export default HomePage