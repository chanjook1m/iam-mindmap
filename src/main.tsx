import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import { Root } from "./routes/Root";
import TestLayout from "./layout/TestLayout";
import Test from "./routes/Test";
import { Note } from "./routes/Note";

import { loader as NoteLoader } from "./routes/Note";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Root /> },
      { path: "/daynote/:noteId", element: <Note />, loader: NoteLoader },
    ],
  },
  { element: <TestLayout />, children: [{ path: "/test", element: <Test /> }] },
]);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
