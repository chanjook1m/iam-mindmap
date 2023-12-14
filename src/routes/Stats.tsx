import { Suspense, useEffect, useState } from "react";
import { supabase } from "../utils/libConfig";
import { getUserId, parseToDOM } from "../utils/utils";
import { useLoaderData } from "react-router-dom";

export async function loader() {
  const uid = await getUserId();
  const { data, error } = await supabase
    .from("graphdata")
    .select()
    .eq("user_id", uid);
  // const totalData = parseToDOM(data);
  // console.log(data);
  // return { totalData };
  return null;
}

export default function Stats() {
  // const { totalData } = useLoaderData();
  // console.log(totalData);
  return (
    <div>
      <p></p>
      <ul className="brainwords">
        <li>33% - Frontend</li>
        <ul>
          <li>11% - React</li>
        </ul>
        <li>22% - Learning</li>
        <li>11% - German</li>
      </ul>
    </div>
  );
}
