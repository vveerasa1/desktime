import React, { Suspense ,useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { routes } from './routes/index';
import { useAuth } from "react-oidc-context";

const theme = createTheme(); 

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {

 const auth = useAuth();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </Router>
    </ThemeProvider>
    // <>hello</>
  )
}

export default App
