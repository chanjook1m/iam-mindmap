import { Outlet } from "react-router-dom";
import "./authlayout.styles.css";
export default function AuthLayout() {
  return (
    <div className="auth_layout">
      <Outlet />
    </div>
  );
}
