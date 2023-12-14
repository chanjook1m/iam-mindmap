import { useState, useRef, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import cytoscape, { InputEventObject } from "cytoscape";
import cola from "cytoscape-cola";
import contextMenus from "cytoscape-context-menus";
import domNode from "cytoscape-dom-node";
import { throttle } from "lodash-es";
// import { supabase } from "./SignIn";
import { supabase } from "../utils/libConfig";

cytoscape.use(cola);
cytoscape.use(contextMenus);
cytoscape.use(domNode);
// import "cytoscape-context-menus/cytoscape-context-menus.css";
import { cystoConfig, contextMenuOptions } from "../utils/libConfig";
import { GraphType, NodeType } from "../../typings/global";
import { Current } from "../../typings/cytoscape";
import {
  createNodeDomElement,
  getUserId,
  // getGraphData,
  parseToDOM,
  showInput,
} from "../utils/utils";
import { userInfo } from "os";

export async function loader({ params }) {
  // const json = await getGraphData(params.noteId);
  const uid = await getUserId();
  const { data, error } = await supabase
    .from("graphdata")
    .select()
    .eq("date", params.noteId.toString())
    .eq("user_id", uid);
  // console.log(data);
  const noteData = data?.length ? parseToDOM(data)[0].data : [];
  // console.log(noteData);
  return { noteData };
}

export function Note() {
  const cyRef = useRef(null);
  const cy = useRef<cytoscape.Core>();

  const { noteId } = useParams();
  const [data, setData] = useState<GraphType>([]);
  const { noteData } = useLoaderData();

  const saveToServer = async () => {
    const edges = (cy.current?.json() as Current).elements.edges;
    const nodes = (cy.current?.json() as Current).elements.nodes;
    const nData = [...edges, ...nodes];
    console.log("json", nData);

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

  useEffect(() => {
    const initData: GraphType = [
      {
        data: { id: `root-${noteId}`, label: noteId as string },
      },
    ];
    setData(initData);

    if (noteData.length) {
      setData(noteData);
    }
    // getData();
  }, [noteId]);

  useEffect(() => {
    cy.current = cytoscape({
      container: cyRef.current,
      elements: data,
      style: cystoConfig.style,
      layout: cystoConfig.layout,
    });

    cy.current.domNode();

    let isTapHoldTriggered = false;

    contextMenuOptions.menuItems.forEach((menu) => {
      if (menu.id === "remove") {
        menu.onClickFunction = () => {
          const selected = cy.current?.nodes(":selected")[0];

          if (selected) {
            cy.current?.remove(selected);
            const layout = cy.current?.makeLayout(cystoConfig.layout);
            layout?.run();
          }
        };
      }
    });
    cy.current.contextMenus(contextMenuOptions);

    const cxttapHandler = (evt: InputEventObject) => {
      const node = evt.target;
      const prevNodes = cy.current?.elements();

      prevNodes?.unselect();
      node.select();
    };

    const tapHandler = (evt: InputEventObject) => {
      if (isTapHoldTriggered) {
        isTapHoldTriggered = !isTapHoldTriggered;
        return;
      }
      const node = evt.target;
      const targetId = node.data("id");
      // console.log(targetId);
      showInput(targetId, saveToServer);
      saveToServer();
    };

    const tapholdHandler = (evt: InputEventObject) => {
      isTapHoldTriggered = true;
      const currentNodeId = nodeid++;
      const targetId = evt.target.data("id"); //cy.nodes()[Math.floor(Math.random() * cy.nodes().length)].data('id')

      const div = createNodeDomElement(
        `node-${currentNodeId.toString()}`,
        `node-${currentNodeId}`
      );

      cy.current?.nodes().forEach((node) => {
        node.lock();
      });
      cy.current?.add([
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

      const layout = cy.current?.makeLayout(cystoConfig.layout);
      layout?.run();
      layout?.on("layoutstop", () => {
        cy.current?.nodes().forEach((node) => {
          node.unlock();
        });
      });
      saveToServer();
    };
    const throttleOnTap = throttle((evt: InputEventObject) => {
      tapHandler(evt);
    }, 1500);

    const throttleOnTaphold = throttle((evt: InputEventObject) => {
      tapholdHandler(evt);
    }, 2000);

    const onTap = (evt: InputEventObject) => {
      throttleOnTap(evt);
    };
    const onCxttap = (evt: InputEventObject) => {
      cxttapHandler(evt);
    };
    const onTaphold = (evt: InputEventObject) => {
      throttleOnTaphold(evt);
    };

    cy.current.on("cxttap", "node", (evt) => onCxttap(evt));
    cy.current?.on("tap", "node", (evt) => onTap(evt));

    let nodeid = 1;
    cy.current.on("taphold", "node", (evt) => onTaphold(evt));

    // console.log(cy.json().elements.edges, cy.json().elements.nodes);
    return () => {
      cy?.current?.destroy();
    };
  }, [data]);

  return (
    <div style={{ height: "100vh" }}>
      <div ref={cyRef} style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
}
