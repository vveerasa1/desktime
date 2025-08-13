import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { store } from './redux/store/store.js';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_6IVaAL8X0",
  client_id: "4o3gl6qqe1i5uapeitu56p3lst",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  // post_logout_redirect_uri: "http://localhost:5173",
  //  metadata: {
  //   end_session_endpoint: "https://us-east-16ivaal8x0.auth.us-east-1.amazoncognito.com/logout"
  // },
  scope: "email openid phone profile aws.cognito.signin.user.admin",
  automaticSilentRenew: false,
  // metadata: {
  //   end_session_endpoint:
  //     "https://us-east-16ivaal8x0.auth.us-east-1.amazoncognito.com/logout",
  // },
};

const onSigninCallback = async (user) => {
  console.log('User signed in:', user?.profile);
  window.history.replaceState({}, document.title, window.location.pathname);
};

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSigninCallback}>
          <App />
        </AuthProvider>
      </LocalizationProvider>
    </StrictMode>
  </Provider>
);
