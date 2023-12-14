import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const uid = localStorage.getItem(import.meta.env.VITE_LOCALSTORAGE_KEY);
  console.log(uid);
  if (!uid) {
    return <Navigate to="/signin" />;
  }
  return <>{children}</>;
}
