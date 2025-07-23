import { useAuth } from 'react-oidc-context';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const auth = useAuth();

  // useEffect(() => {
  //   if (!auth.isLoading && !auth.isAuthenticated) {
  //     auth.signinRedirect(); // Redirect to Cognito Hosted UI
  //   }
  // }, [auth]);

  // if (auth.isLoading || !auth.isAuthenticated) {
  //   return <div>Redirecting to login...</div>;
  // }

  return <Outlet />;
}
