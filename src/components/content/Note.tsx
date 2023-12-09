import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import contextMenus from "cytoscape-context-menus";

cytoscape.use(cola);
cytoscape.use(contextMenus);
// import "cytoscape-context-menus/cytoscape-context-menus.css";
import { cystoConfig, contextMenuOptions } from "../../utils/libConfig";
import { GraphType } from "../../../typings/global";

export function Note() {
  const cyRef = useRef(null);
  const cy = useRef<cytoscape.Core>();
  const { noteId } = useParams();
  const [data, setData] = useState<GraphType>([]);

  const getData = () => {
    fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${noteId}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("d", data.data);
        setData(() => data.data);
      });
  };
  // setData(() => element[Number(noteId) - 1]); // TODO: get server data

  useEffect(() => {
    getData();
  }, [noteId]);

  useEffect(() => {
    cy.current = cytoscape({
      container: cyRef.current,
      elements: data,
      style: cystoConfig.style,
      layout: cystoConfig.layout,
    });
    contextMenuOptions.menuItems.forEach((menu) => {
      if (menu.id === "remove") {
        menu.onClickFunction = () => {
          const selected = cy.current?.nodes(":selected")[0];
          if (selected) {
            // selected.children().move({
            //   parent: selected.parent().id() ? selected.parent().id() : null,
            // });
            selected.remove();
            selected.connectedEdges().remove();
          }
        };
      }
    });
    const instance = cy.current?.contextMenus(contextMenuOptions);

    cy.current.on("cxttap", "node", (evt) => {
      const node = evt.target;

      // Clear previous selections
      cy.current?.elements().unselect();

      // Select the right-clicked node
      node.select();

      // // You can perform additional actions here
      // console.log("Node selected:", node.data());
    });

    cy.current?.on("tap", "node", (evt) => {
      // Check if it's a double tap
      console.log("taphold");
    });
    let nodeid = 1;
    cy.current.on("taphold", "node", (evt) => {
      const currentNodeId = nodeid++;
      const targetId = evt.target.data("id"); //cy.nodes()[Math.floor(Math.random() * cy.nodes().length)].data('id')

      cy.current?.nodes().forEach((node) => {
        node.lock();
      });
      cy.current?.add([
        {
          group: "nodes",
          data: {
            id: currentNodeId.toString(),
            label: "",
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
    });

    // console.log(cy.json().elements.edges, cy.json().elements.nodes);
    return () => {
      cy?.current?.destroy();
    };
  }, [data]);

  return (
    <div style={{ height: "100vh" }}>
      <button
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "gray",
          margin: "10px",
        }}
        onClick={() => {
          // setData((prev) => {
          //   return [...prev, ...nData];
          // });

          const edges = cy.current?.json().elements.edges;
          const nodes = cy.current?.json().elements.nodes;
          const nData = [...edges, ...nodes];
          console.log("json", nData);
          // console.log("working");

          fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${noteId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nData),
          })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }}
      >
        Save
      </button>
      <div ref={cyRef} style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
}
