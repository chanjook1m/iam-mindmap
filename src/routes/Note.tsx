import { useState, useRef, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import cytoscape, { InputEventObject } from "cytoscape";
import cola from "cytoscape-cola";
import fcose from "cytoscape-fcose";
import contextMenus from "cytoscape-context-menus";
import domNode from "cytoscape-dom-node";
import { throttle } from "lodash-es";
// import { supabase } from "./SignIn";
import { supabase } from "../utils/libConfig";
import popper from "cytoscape-popper";
import { makeNodeToPopper } from "../utils/utils";

// cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(contextMenus);
cytoscape.use(domNode);
cytoscape.use(popper);
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

import "./note.styles.css";

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
        data: { id: `root-${noteId}`, label: noteId as string, pNode: "root" },
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

    const isTapHoldTriggered = false;

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

    const onCxttap = (evt: InputEventObject) => {
      cxttapHandler(evt);
    };

    cy.current.on("cxttap", "node", (evt) => onCxttap(evt));

    cy.current.on("mouseover", "node", (event) => {
      const node = event.target;
      if (node._private.data?.pNode) node.tippy.show();
    });
    cy.current.on("mouseout", "node", (event) => {
      const node = event.target;
      if (node._private.data?.pNode) node.tippy.hide();
    });

    // console.log(cy.json().elements.edges, cy.json().elements.nodes);
    cy.current.ready(() => {
      cy.current?.nodes().forEach((node) => {
        if (node._private.data?.pNode) makeNodeToPopper(node, cy.current);
      });
    });

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
