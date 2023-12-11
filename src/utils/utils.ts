import { DomObject, NodeType } from "../../typings/global";

export const createNodeDomElement = (id: string, content: string) => {
  const div = document.createElement("div");
  div.setAttribute("id", `${id}`);
  div.innerHTML = `${content}`;
  div.style.minWidth = "min-content";
  div.style.maxWidth = "max-content";
  div.style.textAlign = "center";
  return div;
};

export const parseToDOM = (json) => {
  if (json?.data[0]?.data) {
    console.log("d", json.data[0].data);
    json.data[0].data.forEach((ele: NodeType) => {
      if (ele.data.dom) {
        const { id, content } = ele.data.dom as DomObject;
        ele.data.dom = createNodeDomElement(id, content);
      }
    });
    return json.data[0].data;
    // setData(() => json.data[0].data);
  }
};

export const getGraphData = (id: string) => {
  const res = fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${id}`);
  return res.then((res) => res.json());
};
