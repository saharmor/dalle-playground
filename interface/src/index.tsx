import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import ReactDOM from 'react-dom/client';

import App from 'App';

import { FormContextProvider } from './contexts/FormContext';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FormContextProvider>
        <App />
      </FormContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
