import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import { Root } from "./routes/Root";
import AuthLayout from "./layout/AuthLayout";
import { Note } from "./routes/Note";

import { loader as NoteLoader } from "./routes/Note";
import SignIn from "./routes/SignIn";

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
  {
    element: <AuthLayout />,
    children: [{ path: "/test", element: <SignIn /> }],
  },
]);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
