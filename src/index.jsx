// scroll bar
import 'simplebar/src/simplebar.css';
import React, { Suspense } from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

//
import App from './App';
// import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { Button } from '@mui/material';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient()
// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
   <HelmetProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <Suspense fallback>
            <SnackbarProvider 
                action={(snackbarId) => (
                  <Button sx={{ color: 'white' }} onClick={() => closeSnackbar(snackbarId)}>
                    X
                  </Button>
                )} 
                maxSnack={3} 
                autoHideDuration={3000}
              >
              <App />
            </SnackbarProvider>
          </Suspense>
        </RecoilRoot>
      </QueryClientProvider>
    </BrowserRouter>
  </HelmetProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
