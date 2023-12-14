import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import AuthLayout from "./layout/AuthLayout";
import { Root } from "./routes/Root";
import { Note } from "./routes/Note";
import SignIn from "./routes/SignIn";

import { loader as NoteLoader } from "./routes/Note";
import { loader as StatsLoader } from "./routes/Stats";
import ProtectedRoute from "./routes/ProtectedRoute";

import NotFound from "./components/common/NotFound";
import { getUserId } from "./utils/utils";
import Stats from "./routes/Stats";

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
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ProtectedRoute uid={getUserId()}>
          <RootLayout />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      { path: "/", element: <Root /> },
      { path: "/daynote/:noteId", element: <Note />, loader: NoteLoader },
      { path: "/stats", element: <Stats />, loader: StatsLoader },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/signin", element: <SignIn /> }],
  },
  {
    element: <NotFound />,
    path: "*",
  },
]);

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
});
