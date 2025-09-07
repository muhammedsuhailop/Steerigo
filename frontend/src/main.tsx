import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Get root element with proper error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Root element not found. Make sure index.html contains an element with id="root"'
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
