import { NavLink } from "react-router-dom";
import "./header.styles.css";
export default function Header() {
  const data = [
    { id: 1, path: "/", title: "Calendar" },
    { id: 2, path: "/stats", title: "Stats" },
  ];
  return (
    <nav className="header">
      <span> Logo</span>
      <ul className="header__navbar">
        {data.map((ele) => (
          <li key={ele.id}>
            <NavLink to={ele.path}>{ele.title}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
