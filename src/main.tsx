import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css";
import { FilterProvider } from '@/context/FilterContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <App />
      </FilterProvider>
    </QueryClientProvider>
  </React.StrictMode>
);