import { NavLink } from "react-router-dom";
import "./sidebar.styles.css";
import { useEffect, useState } from "react";
import { getUserId, parseToDOM } from "../../utils/utils";
import { supabase } from "../../utils/libConfig";

type dataType = {
  id: number;
  date: string;
};

type navLinkType = {
  isActive: boolean;
  isPending: boolean;
};

export default function SideBar() {
  // const data: dataType[] = [
  //   { id: 1, date: "2022-02-01" },
  //   { id: 2, date: "2022-02-02" },
  //   { id: 3, date: "2022-02-03" },
  // ];
  const [data, setData] = useState<dataType[]>();
  useEffect(() => {
    const fetchData = async () => {
      const uid = await getUserId();
      const { data, error } = await supabase
        .from("graphdata")
        .select()
        .eq("user_id", uid)
        .order("date", { ascending: false });
      const totalData = parseToDOM(data);
      console.log(totalData);
      setData(totalData);
    };
    fetchData();
  }, []);
  return (
    <aside className="sidebar">
      <ul className="sidebar__items">
        {data?.map((ele) => (
          <li key={ele.id}>
            <NavLink
              to={`daynote/${ele.date}`}
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
