import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  uid: Promise<string | undefined>;
  children: React.ReactElement;
};

export default function ProtectedRoute({ uid, children }: ProtectedRouteProps) {
  console.log(uid);
  if (!uid) {
    return <Navigate to="/test" />;
  }
  return <>{children}</>;
}
