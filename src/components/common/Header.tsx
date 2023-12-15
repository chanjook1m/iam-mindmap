import { NavLink, useNavigate } from "react-router-dom";
import "./header.styles.css";
import { useEffect, useState } from "react";
import { getUserId } from "../../utils/utils";
import { supabase } from "../../utils/libConfig";
export default function Header() {
  const navData = [
    { id: 1, path: "/", title: "Calendar" },
    { id: 2, path: "/stats", title: "Stats" },
  ];
  const navigate = useNavigate();
  const [uid, setUid] = useState<string | undefined>();
  const fetchUserId = async () => {
    const id = await getUserId();
    setUid(id);
  };
  useEffect(() => {
    fetchUserId();
  }, []);

  return (
    <nav className="header">
      <span className="header__logo"> Logo</span>
      <ul className="header__navbar">
        {navData.map((ele) => (
          <li key={ele.id}>
            <NavLink to={ele.path} className="header__navbar__item">
              {ele.title}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="header__controller">
        {!uid ? (
          <button
            className="header__controller__login"
            onClick={() => navigate("/signin")}
          >
            Login
          </button>
        ) : (
          <button
            className="header__controller__logout"
            onClick={async () => {
              await supabase.auth.signOut();
              await fetchUserId();
              navigate(0);
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
