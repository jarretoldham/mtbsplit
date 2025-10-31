import { createFileRoute, Navigate } from '@tanstack/react-router';
import Login from '../components/Login';
import { useAuth } from '../contexts/AuthContext';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
});

function LoginRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <Login />;
}
