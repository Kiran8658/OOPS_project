// src/RouterProvider.tsx
import React from "react";
import { createBrowserRouter, RouterProvider as RRProvider } from "react-router-dom";

// Layout / App
import App from "./App";

// Pages
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Stores from "./pages/Stores";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Optional: you can wrap Routes with authentication logic in App.tsx

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Dashboard /> }, // default page for "/"
        { path: "dashboard", element: <Dashboard /> },
        { path: "orders", element: <Orders /> },
        { path: "inventory", element: <Inventory /> },
        { path: "analytics", element: <Analytics /> },
        { path: "alerts", element: <Alerts /> },
        { path: "stores", element: <Stores /> },
        { path: "settings", element: <Settings /> },
        { path: "*", element: <NotFound /> }, // catch-all 404
      ],
    },
    { path: "/login", element: <Login onLogin={() => {}} /> },
    { path: "/register", element: <Register onRegister={() => {}} /> },
  ]
);

export const RouterProvider = () => <RRProvider router={router} />;
