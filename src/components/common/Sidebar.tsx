import { NavLink } from "react-router-dom";
import "./sidebar.styles.css";

type dataType = {
  id: number;
  date: string;
};

type navLinkType = {
  isActive: boolean;
  isPending: boolean;
};

export default function SideBar() {
  const data: dataType[] = [
    { id: 1, date: "2022-02-01" },
    { id: 2, date: "2022-02-02" },
    { id: 3, date: "2022-02-03" },
  ];
  return (
    <aside className="sidebar">
      <ul className="sidebar__items">
        {data.map((ele) => (
          <li key={ele.id}>
            <NavLink
              to={`daynote/${ele.id}`}
              className={`navlink ${({ isActive, isPending }: navLinkType) =>
                isActive ? "active" : isPending ? "pending" : ""}`}
            >
              {ele.date}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
