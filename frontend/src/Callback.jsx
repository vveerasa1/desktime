import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Callback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth:", auth);
    // if (!auth.isLoading && !auth.isAuthenticated) {
    //   auth.signinRedirect(); // Redirect to Cognito Hosted UI
    // }
    if (!auth.isLoading && auth.isAuthenticated) {
      localStorage.setItem('token', auth.user.access_token)
      navigate('/dashboard'); // or your landing page
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return <div>Processing login...</div>;
}
