import React, { useEffect, useState } from 'react';
import { getTickets } from '../api/auth';
import { useAuth } from "../context/UserContext";

function OrderConfirmation() {
  const [tickets, setTickets] = useState([]);
  const {user} = useAuth()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await getTickets();
        console.log(res)
        setTickets(res);  // Suponiendo que la respuesta contiene directamente el array de tickets
      } catch (error) {
        console.error('Error al obtener los tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  

  const userTickets = Array.isArray(tickets.data)
  ? tickets.data.filter(ticket => ticket.purchaser === user.email)
  : [];

return (
  <div>
    <h1>Confirmación de Orden</h1>
    <p>Gracias por tu compra, {user.first_name}!</p>
    <p>Tus compras: </p>
    <ul>
      {userTickets.length > 0 ? (
        userTickets.map((ticket) => (
          <li key={ticket._id}>
            <p>{`Valor: ${ticket.amount}`}</p>
            <p>{`Fecha de compra: ${ticket.createdAt}`}</p>
            <p>{`Email del comprador: ${ticket.purchaser}` }</p>
          </li>
        ))
      ) : (
        <li>No hay tickets disponibles para este usuario</li>
      )}
    </ul>
  </div>
);
}

export default OrderConfirmation;