import { useState, useRef, useEffect } from "react";
import { useLoaderData, useParams } from "react-router-dom";

import cytoscape, { InputEventObject } from "cytoscape";
import fcose from "cytoscape-fcose";
import contextMenus from "cytoscape-context-menus";
import domNode from "cytoscape-dom-node";
import expandCollapse from "cytoscape-expand-collapse";
import undoRedo from "cytoscape-undo-redo";

import {
  cytoDepthColor,
  cytoStyle,
  expandCollapseOptions,
  supabase,
} from "../utils/libConfig";
import popper from "cytoscape-popper";
import { makeNodeToPopper } from "../utils/utils";

// cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(contextMenus);
cytoscape.use(domNode);
cytoscape.use(popper);

undoRedo(cytoscape);
expandCollapse(cytoscape);

import { cystoConfig, contextMenuOptions } from "../utils/libConfig";
import { GraphType } from "../../typings/global";
import { getUserId, parseToDOM } from "../utils/utils";

import "./note.styles.css";

export async function loader({ params }) {
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
  const [collapsed, setCollapsed] = useState(true);
  const { noteData } = useLoaderData();

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

    for (let i = 0; i < 100; i++) {
      const edgeStyle = {
        selector: `edge.depth-${i}`,
        style: {
          "line-color": cytoDepthColor[i],
        },
      };
      const nodeStyle = {
        selector: `node.depth-${i}`,
        style: {
          "border-width": 3,
          "border-color": "black",
          "background-color": cytoDepthColor[i],
          // opacity: 0.9,
        },
      };
      cytoStyle.push(edgeStyle);
      cytoStyle.push(nodeStyle);
    }
    cy.current.style(cytoStyle);

    // const api = cy.current.expandCollapse(expandCollapseOptions);
    cy.current.contextMenus(contextMenuOptions);
    cy.current.domNode();

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

    cy.current.on("click", "node", (event) => {
      const node = event.target;
      if (node.classes()[0] === "tmp") {
        const pos = node.position();
        const zoomLevel: number = cy.current!.zoom();
        // console.log(zoomLevel);
        if (zoomLevel <= 1) {
          cy.current!.zoom({ level: 2, position: pos });
        } else {
          cy.current!.animate({
            zoom: 0.9,
            center: { x: pos.x, y: pos.y },
          });
        }
        cy.current?.fit(event.target, 50); // 50 is the padding
      } else if (node.classes()[0] !== "tmp") {
        const connectedEdges = node.connectedEdges().map((edge) => ({
          data: {
            source: edge.source().id(),
            target: edge.target().id(),
          },
          style: edge.style(), // 엣지 스타일 저장
        })); // 연결된 엣지 정보 저장
        const nodeData = node.data(); // 노드 데이터 저장
        const nodePosition = node.position(); // 노드 위치 저장
        const nodeStyle = node.style(); // 노드 스타일 저장

        cy.current!.remove(node); // 노드 제거

        const newNode = cy.current!.add({
          group: "nodes",
          data: nodeData,
          position: nodePosition,
        }); // 노드 다시 추가
        connectedEdges.forEach((edgeData) => {
          if (edgeData.data.source === node.id()) {
            edgeData.data.source = newNode.id();
          } else {
            edgeData.data.target = newNode.id();
          }
          const newEdge = cy.current!.add({
            group: "edges",
            data: edgeData.data,
          }); // 엣지 다시 추가
          newEdge.style(edgeData.style); // 엣지 스타일 복원
        });

        newNode.style(nodeStyle); // 노드 스타일 복원
        // makeNodeToPopper(newNode, cy.current);
        // newNode?.tippy?.show();
        // const layout = cy.current?.makeLayout(cystoConfig.layout);
        // layout?.run();
        newNode.data("dom").classList.add("selected");
      }
    });

    cy.current.on("select", "node", (event) => {
      const node = event.target;
      console.log("select");
      // node.data("dom").classList.add("selected");
      node.select();
    });
    cy.current.on("unselect", "node", (event) => {
      const node = event.target;
      // node.data("dom").classList.remove("selected");
      node.unselect();
      console.log("unselect");
    });
    cy.current.on("mouseover", "node", (event) => {
      const node = event.target;
      // if (node._private.data?.pNode) node.tippy.show();
    });
    cy.current.on("mouseout", "node", (event) => {
      const node = event.target;

      // if (node._private.data?.pNode) node.tippy.hide();
    });
    cy.current.on("expandcollapse.beforecollapse", "node", function (event) {
      const node = event.target; // the node that is about to be collapsed
      const content = node.descendants()[0].data("dom").innerHTML;
      node.data("dom")?.classList.remove("hidden");

      node.data("dom").innerHTML = content;
      node
        .descendants()
        .forEach((d: cytoscape.NodeSingular) =>
          d.data("dom")?.classList.add("hidden")
        );
    });

    cy.current.on("expandcollapse.afterexpand", "node", function (event) {
      const node = event.target; // the node that is about to be collapsed
      node.data("dom")?.classList.add("hidden");
      node
        .descendants()
        .forEach((d: cytoscape.NodeSingular) =>
          d.data("dom")?.classList.remove("hidden")
        );
    });
    cy.current.ready(() => {
      // -> expand/collapse function disabled
      // cy.current?.nodes().forEach((node) => {
      //   if (api.isCollapsible(node)) {
      //     node.data("dom").classList.add("hidden");
      //     node
      //       .descendants()
      //       .forEach((d: cytoscape.NodeSingular) =>
      //         d.data("dom").classList.remove("hidden")
      //       );
      //   } else if (api.isExpandable(node)) {
      //     const content = node.descendants()[0].data("dom").innerHTML;
      //     node.data("dom").classList.remove("hidden");
      //     node.data("dom").innerHTML = content;
      //     node
      //       .descendants()
      //       .forEach((d: cytoscape.NodeSingular) =>
      //         d.data("dom").classList.add("hidden")
      //       );
      //   }
      // });
    });
    // console.log(cy.json().elements.edges, cy.json().elements.nodes);
    cy.current.ready(() => {
      cy.current?.nodes().forEach((node: cytoscape.NodeSingular) => {
        if (node._private.data.pNode) makeNodeToPopper(node, cy.current);
      });
      const layout = cy.current?.makeLayout(cystoConfig.layout);
      layout?.run();
    });

    return () => {
      cy?.current?.destroy();
    };
  }, [data]);

  return (
    <>
      <div style={{ height: "100vh" }}>
        {collapsed && (
          <div className="sidebarr">
            <div>Date</div>
            <div>TextArea</div>
            <div>Options</div>
          </div>
        )}
        <div ref={cyRef} style={{ width: "100%", height: "100vh" }}></div>
      </div>
    </>
  );
}
