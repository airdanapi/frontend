import { Navigate } from 'react-router-dom';
import apiService from '../services/api';

export default function ProtectedRoute({ children }) {
  const token = apiService.getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
