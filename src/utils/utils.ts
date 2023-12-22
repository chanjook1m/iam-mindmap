import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { DomObject, GraphType, NodeType } from "../../typings/global";
import { cystoConfig, supabase } from "./libConfig";
import { Current } from "../../typings/cytoscape";

export const createNodeDomElement = (id: string, content: string) => {
  const div = document.createElement("div");
  div.setAttribute("id", `${id}`);
  div.setAttribute("class", `node`);
  div.innerHTML = `${content}`;
  return div;
};

export const parseToDOM = (json) => {
  console.log(json);

  if (json === null) json = [];
  json?.forEach((ele) => {
    console.log("ele", ele);
    ele.data.forEach((d: NodeType) => {
      if (d.data.dom) {
        const { id, content } = d.data.dom as DomObject;
        d.data.dom = createNodeDomElement(id, content);
      }
    });
  });
  console.log(json);
  return json;
  // console.log("d", json.data[0].data);
  // json.data[0].data.forEach((ele: NodeType) => {
  //   if (ele.data.dom) {
  //     const { id, content } = ele.data.dom as DomObject;
  //     ele.data.dom = createNodeDomElement(id, content);
  //   }
  // });
  // return json.data[0].data;
  // setData(() => json.data[0].data);
};

export const getGraphData = (id: string) => {
  const res = fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.then((res) => res.json());
};

export const showInput = (id: string, callback) => {
  // Get the div element
  const outputDiv = document.getElementById(`node-${id}`);
  if (outputDiv) {
    // Create an input element
    const inputElement = document.createElement("input");
    inputElement.type = "text";

    // Set the value of the input to the current content of the div
    (inputElement as HTMLInputElement).value = (
      outputDiv as HTMLElement
    ).innerHTML;

    // Replace the div with the input element
    // outputDiv.replaceWith(inputElement);
    outputDiv?.appendChild(inputElement);
    // Focus on the input element
    inputElement.focus();

    // Add an event listener to handle changes in the input
    inputElement.addEventListener("focusout", function (event) {
      (outputDiv as HTMLElement).innerHTML = (
        event.target as HTMLInputElement
      ).value.toString();
      if (outputDiv?.childElementCount) outputDiv?.removeChild(inputElement);
      callback();
    });
  }
};

export const getUserId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user.id;
};

// ---
const saveToServer = async (cystoInstance) => {
  const edges = (cystoInstance.json() as Current).elements.edges;
  const nodes = (cystoInstance.json() as Current).elements.nodes;
  const nData = [...edges, ...nodes];
  console.log("json", nData);
  const noteId = window.location.href.split("/").at(-1);
  (nData as GraphType).forEach((ndata) => {
    if ((ndata as NodeType).data.dom) {
      const divData = {
        id: ((ndata as NodeType).data.dom as HTMLElement).id,
        content: ((ndata as NodeType).data.dom as HTMLElement).innerHTML,
      };
      (ndata as NodeType).data.dom = divData;
    }
  });
  console.log(nData);
  const uid = await getUserId();

  const { data, error } = await supabase.from("graphdata").upsert(
    {
      date: noteId,
      data: nData,
      user_id: uid,
      identifier: `${noteId}-${uid}`,
    },
    { onConflict: "identifier" }
  );

  console.log(error, data);
};

const onClickAdd = (event, cystoInstance, node) => {
  const currentNodeId = Date.now();
  const targetId = node.data("id");

  const div = createNodeDomElement(
    `node-${currentNodeId.toString()}`,
    `node-${currentNodeId.toString().substring(0, 4)}`
  );

  cystoInstance.add([
    {
      group: "nodes",
      data: {
        id: currentNodeId.toString(),
        label: "",
        dom: div,
        pNode: targetId.toString(),
        // parent: targetId.toString(),
      },
    },
    {
      group: "edges",
      data: {
        id: currentNodeId + "-edge",
        source: currentNodeId,
        target: targetId,
      },
    },
  ]);

  const lastNode = cystoInstance.nodes().last();
  makeNodeToPopper(lastNode, cystoInstance);
  cystoInstance.center(node);
  const layout = cystoInstance.makeLayout(cystoConfig.layout);
  layout?.run();
  saveToServer(cystoInstance);

  const lastNodeId = lastNode.data("id");
  showInput(lastNodeId, () => {});
};

const onClickEdit = (event, cystoInstance, node) => {
  const targetId = node.data("id");
  console.log(targetId);
  showInput(targetId, () => saveToServer(cystoInstance));
};

const onClickDel = (event, cystoInstance, node) => {
  // console.log(node._private.data.dom);

  cystoInstance.remove(node);
  const layout = cystoInstance.makeLayout(cystoConfig.layout);
  layout?.run();
};

const menuItem = [
  { text: "Add", onClick: onClickAdd },
  { text: "Edit", onClick: onClickEdit },
  { text: "Del", onClick: onClickDel },
];

export const makeNodeToPopper = (ele, cystoInstance) => {
  if (ele) {
    const ref = ele.popperRef(); // used only for positioning

    const domEle = document.createElement("div");
    domEle.className = "menu-container";
    ele.tippy = tippy(domEle, {
      getReferenceClientRect: ref.getBoundingClientRect,
      content: () => {
        const content = document.createElement("div");
        const ul = document.createElement("ul");
        ul.className = "menu-list";

        for (let i = 0; i < 3; i++) {
          const li = document.createElement("li");
          li.textContent = menuItem[i].text;
          li.className = `menu menu-${i}`;
          li.onclick = function (e) {
            menuItem[i].onClick(e, cystoInstance, ele);
          };
          ul.appendChild(li);
        }

        content.appendChild(ul);
        return content;
      },
      trigger: "manual", // probably want manual mode
      placement: "right",
      appendTo: document.body,
      delay: [0, 2000],
      interactive: true,
    });
  }
};
