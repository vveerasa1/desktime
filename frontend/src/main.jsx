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
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_9wz4Couvt",
  client_id: "ci9eipuin29bm62r5pcvdc3vr",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "code",
  scope: "email openid phone",
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
