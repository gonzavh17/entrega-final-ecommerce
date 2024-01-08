import React, { useEffect, useState } from "react";
import { useAuth } from "../context/UserContext";
import { getProducts } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function ProductList () {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProducts({});
        const data = await res.data;
        setProducts(data.message.docs);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClickProduct = (productId) => {
    console.log("Product clicked with ID:", productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div>
      <p>Bienvenido, {user ? user.first_name : "Guest"}</p>
      <p>Product List</p>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <Link to={`/product/${product._id}`}>
                {product.title} - {product.description}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
