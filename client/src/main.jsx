import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import App from "./App";

import "./index.css";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import {
  NotificationProvider,
} from "./context/NotificationContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
   <BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
      <NotificationProvider>
        <AuthProvider>
          <Toaster position="top-right" />

          <App />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>
);