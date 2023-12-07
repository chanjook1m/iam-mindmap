import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import Root from "./routes/Root";
import TestLayout from "./layout/TestLayout";
import Test from "./routes/Test";

const router = createBrowserRouter([
  { element: <RootLayout />, children: [{ path: "/", element: <Root /> }] },
  { element: <TestLayout />, children: [{ path: "/test", element: <Test /> }] },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
