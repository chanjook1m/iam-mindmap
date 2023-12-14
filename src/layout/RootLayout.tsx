import { Outlet, useNavigation } from "react-router-dom";
import "./rootlayout.styles.css";
import Header from "../components/common/Header";
import SideBar from "../components/common/Sidebar";
import Container from "../components/common/Container";

export default function RootLayout() {
  const navigation = useNavigation();
  return (
    <div className="root_layout">
      <Header />
      <Container>
        <SideBar />
        <div className={navigation.state === "loading" ? "loading" : ""}>
          <Outlet />
        </div>
      </Container>
    </div>
  );
}
