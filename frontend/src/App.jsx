import React, {Suspense} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import { useRoutes, BrowserRouter, HashRouter } from 'react-router-dom';
import {routes} from './routes/index'; 

const theme = createTheme(); 

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {

 const Router = process.env.NODE_ENV === 'development' ? BrowserRouter : HashRouter;
 
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
