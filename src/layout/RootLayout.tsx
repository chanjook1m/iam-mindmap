import { Outlet } from "react-router-dom";
import "./rootlayout.styles.css";
import Header from "../components/common/Header";
import SideBar from "../components/common/Sidebar";
import Container from "../components/common/Container";

export default function RootLayout() {
  return (
    <div className="root_layout">
      <Header />
      <Container>
        <SideBar />
        <Outlet />
      </Container>
    </div>
  );
}
