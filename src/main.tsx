import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { WebSocketProvider } from "./lib/websocketProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <WebSocketProvider >
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster richColors position="top-right" />
          <ReactQueryDevtools />
        </QueryClientProvider>
        </WebSocketProvider>
      </ThemeProvider>
  </React.StrictMode>,
);
