import React, { Suspense, useState ,useEffect} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import {routes} from './routes/index'; 

const theme = createTheme(); 

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {

  // useEffect(() => {

  //   if (window?.electronAPI?.testPreload) {
  //     const preloadMessage = window.electronAPI.testPreload();
  //     console.log("React App: Message from preload script (via testPreload):", preloadMessage); // THIS IS THE KEY LOG
  //   } else {
  //     console.error("React App: window.electronAPI or testPreload is NOT available.");
  //   }

  //   const token = localStorage.getItem('token');

  //   if (token && window?.electronAPI?.sendToken) {
  //     window.electronAPI.sendToken(token);
  //     window.electronAPI.onTokenResponse((message) => {
  //       console.log("React App: Main process responded:", message);
  //     });
  //   } else if (token) {
  //     console.warn("React App: Token exists, but electronAPI.sendToken is not available for initial send.");
  //   } else {
  //     console.warn("React App: No token found in localStorage.");
  //   }
  // }, []);

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
