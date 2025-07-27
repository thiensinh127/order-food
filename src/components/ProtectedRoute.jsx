import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, setShowLogin }) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    setShowLogin(true);
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
