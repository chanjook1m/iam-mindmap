import { NavLink } from "react-router-dom";
import "./sidebar.styles.css";
import { useEffect, useState } from "react";
import { getUserId, parseToDOM } from "../../utils/utils";
import { supabase } from "../../utils/libConfig";
import { GraphType, NodeType } from "../../../typings/global";

type dataType = {
  id: number;
  date: string;
};

type navLinkType = {
  isActive: boolean;
  isPending: boolean;
};

export default function SideBar() {
  const [data, setData] = useState<GraphType[]>();

  const updateData = (newData: NodeType) => {
    setData((prev) => [...prev, newData]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getUserId();
      const { data, error } = await supabase
        .from("graphdata")
        .select()
        .eq("user_id", uid)
        .order("updated_at", { ascending: false });
      const totalData = parseToDOM(data);
      console.log(totalData);
      setData(totalData);
    };
    fetchData();

    // Supbase realtime db set up
    // Handle inserts
    const handleInserts = (payload) => {
      console.log("Insert received!", payload.new);
      updateData(payload.new);
    };
    const handleUpdate = (payload) => {
      console.log(data);
      console.log("Update received!", payload.new);
      setData((prev) => [
        payload.new,
        ...prev.filter((item) => item.date !== payload.new.date),
      ]);
      // updateData(payload.new);
    };

    // Listen to inserts
    supabase
      .channel("graphdata_change")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "graphdata" },
        handleInserts
      )
      .subscribe();

    supabase
      .channel("graphdata_change")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "graphdata" },
        handleUpdate
      )
      .subscribe();
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
