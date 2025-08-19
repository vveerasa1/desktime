import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

const OidcLoginRedirect = () => {
  const auth = useAuth();
  const navigate=useNavigate()
  useEffect(() => {
    console.log('auth', auth);
    if (!auth.isLoading && !auth.isAuthenticated) {
      console.log('auth', auth);
      auth.signinRedirect();
    }
    auth.events.addAccessTokenExpired(() => {
      console.log("Token expired. Logging out.");
    });
    if(auth.isAuthenticated){
      navigate('/callback');
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (auth.isLoading || !auth.isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return null;
};

export default OidcLoginRedirect;
