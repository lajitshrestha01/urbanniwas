// src/auth/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import useUserStore from '../zustand/store';


const ProtectedRoute = ({ children }) => {
  const { user } = useUserStore();


  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
