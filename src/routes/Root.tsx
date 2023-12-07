import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      Hello world!
      <Outlet />
    </div>
  );
}
