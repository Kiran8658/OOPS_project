// main.tsx

// Extend Window interface for React Router dev tools
declare global {
  interface Window {
    __reactRouterDevTools?: {
      v7_startTransition: boolean;
      v7_relativeSplatPath: boolean;
    };
  }
}

// ✅ Opt-in to React Router v7 future flags before imports
window.__reactRouterDevTools = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
