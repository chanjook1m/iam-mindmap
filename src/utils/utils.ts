import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { DomObject, GraphType, NodeType } from "../../typings/global";
import { cystoConfig, supabase } from "./libConfig";
import { Current } from "../../typings/cytoscape";
import { stringify } from "flatted";

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

export const showInput = (id: string, cytoInstance, callback) => {
  // Get the div element
  const outputDiv = document.getElementById(`node-${id}`);
  if (outputDiv) {
    outputDiv.classList.add("writing");
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
    inputElement.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        outputDiv.classList.remove("writing");
        (outputDiv as HTMLElement).innerHTML = (
          event.target as HTMLInputElement
        ).value.toString();
        if (outputDiv?.childElementCount) outputDiv?.removeChild(inputElement);
        const layout = cytoInstance.makeLayout(cystoConfig.layout);
        layout?.run();
        callback();
      }
    });
    inputElement.addEventListener("focusout", function (event) {
      (outputDiv as HTMLElement).innerHTML = (
        event.target as HTMLInputElement
      ).value.toString();
      if (outputDiv?.childElementCount) outputDiv?.removeChild(inputElement);
      const layout = cytoInstance.makeLayout(cystoConfig.layout);
      layout?.run();
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
export const saveToServer = async (cytoInstance) => {
  const edges = (cytoInstance.json() as Current).elements.edges;
  const nodes = (cytoInstance.json() as Current).elements.nodes;

  const nData =
    edges && nodes
      ? [...edges, ...nodes]
      : edges
      ? [...edges]
      : nodes
      ? [...nodes]
      : [];
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

export const onClickAdd = (event, cytoInstance, node) => {
  const currentNodeId = Date.now();
  const tmpCurrentNodeId = Date.now() + 1;
  const targetId = node.data("id");
  const targetDepth = node.data("depth");
  const targetParent = node.data("parent");

  const div = createNodeDomElement(
    `node-${currentNodeId.toString()}`,
    `node-${currentNodeId.toString().substring(0, 4)}`
  );
  div.classList.add(targetDepth ? `depth-${targetDepth + 1}` : `depth-${1}`);

  const tmpDiv = createNodeDomElement(
    `tmpnode-${tmpCurrentNodeId.toString()}`,
    ``
  );
  tmpDiv.setAttribute("class", "hidden");

  console.log(targetDepth, targetParent, currentNodeId, tmpCurrentNodeId);
  if (!targetParent) {
    cytoInstance.add([
      {
        group: "nodes",
        data: {
          id: tmpCurrentNodeId.toString(),
          label: "",
          dom: null,
          pNode: "",
        },
        classes: "tmp",
      },
    ]);
  }

  cytoInstance.add([
    {
      group: "nodes",
      data: {
        id: currentNodeId.toString(),
        label: "",
        dom: div,
        pNode: targetId.toString(),
        depth: targetDepth ? targetDepth + 1 : 1,
        parent: targetParent ? targetParent : tmpCurrentNodeId.toString(),
      },
      classes: targetDepth ? `depth-${targetDepth + 1}` : `depth-${1}`,
    },
    {
      group: "edges",
      data: {
        id: currentNodeId + "-edge",
        source: currentNodeId,
        target: targetId,
      },
      classes: targetDepth ? `depth-${targetDepth + 1}` : `depth-${1}`,
    },
  ]);

  const lastNode = cytoInstance.nodes().last();
  // makeNodeToPopper(lastNode, cytoInstance);
  cytoInstance.center(lastNode);
  cytoInstance.zoom({ level: 2, position: lastNode.position() });
  saveToServer(cytoInstance);

  const lastNodeId = lastNode.data("id");
  showInput(lastNodeId, cytoInstance, () => {
    saveToServer(cytoInstance);
  });
};

export const onClickEdit = (event, cytoInstance, node) => {
  const targetId = node.data("id");
  cytoInstance.center(node);
  cytoInstance.zoom({ level: 2, position: node.position() });
  showInput(targetId, cytoInstance, () => saveToServer(cytoInstance));
};

export const onClickDel = (event, cytoInstance, node) => {
  const ur = cytoInstance.undoRedo();
  node.data("dom").classList.add("removed");
  ur.do("remove", node);

  const layout = cytoInstance.makeLayout(cystoConfig.layout);
  // layout?.run();
  saveToServer(cytoInstance);

  // Get all nodes with the 'tmp' class
  const tmpNodes = cytoInstance.nodes(".tmp");

  // Check if each node has children
  tmpNodes.forEach((node) => {
    if (node.children().length > 0) {
      console.log(`Node ${node.id()} has children`);
    } else {
      console.log(`Node ${node.id()} has no children`);
      node.remove();
    }
  });

  // Listen for the Ctrl + Z keypress event
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.key === "z") {
      ur.undo();
      node.data("dom").classList.remove("removed");
      layout?.run();
      saveToServer(cytoInstance);
    }
  });
};

const menuItem = [
  { text: "Add", onClick: onClickAdd },
  { text: "Edit", onClick: onClickEdit },
  { text: "Del", onClick: onClickDel },
];

export const makeNodeToPopper = (ele, cytoInstance) => {
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
            menuItem[i].onClick(e, cytoInstance, ele);
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
