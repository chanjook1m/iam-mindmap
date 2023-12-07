import { Outlet } from "react-router-dom";
import "./rootlayout.styles.css";
export default function RootLayout() {
  return (
    <div className="root_layout">
      Root Layout
      <Outlet />
    </div>
  );
}
