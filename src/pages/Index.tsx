
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redireciona imediatamente para o dashboard sem useEffect
  return <Navigate to="/dashboard" replace />;
};

export default Index;
