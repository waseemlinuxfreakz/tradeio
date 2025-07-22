import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./styles/mobile-responsive.css"; // mobile css only- new file add by Wassem
import { initializeVotingSystem } from "./lib/votingSystem";
import { initializeReputationSystem } from "./lib/reputationSystem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Initialize the voting system
initializeVotingSystem();

// Initialize the reputation system
initializeReputationSystem();

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const queryClient = new QueryClient();
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
