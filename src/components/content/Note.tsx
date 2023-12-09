import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import contextMenus from "cytoscape-context-menus";
import domNode from "cytoscape-dom-node";

cytoscape.use(cola);
cytoscape.use(contextMenus);
cytoscape.use(domNode);
// import "cytoscape-context-menus/cytoscape-context-menus.css";
import { cystoConfig, contextMenuOptions } from "../../utils/libConfig";
import { GraphType } from "../../../typings/global";
import { Current } from "../../../typings/cytoscape";

export function Note() {
  const cyRef = useRef(null);
  const cy = useRef<cytoscape.Core>();
  const { noteId } = useParams();
  const [data, setData] = useState<GraphType>([]);

  const createNodeDomElement = (id: string, content: string) => {
    const div = document.createElement("div");
    div.setAttribute("id", `${id.toString()}`);
    div.innerHTML = `${content}`;
    div.style.minWidth = "min-content";
    div.style.maxWidth = "max-content";
    div.style.textAlign = "center";
    return div;
  };

  const getData = () => {
    fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${noteId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("d", data.data);
        data.data.forEach((ele) => {
          if (ele.data.dom) {
            const { id, content } = ele.data.dom;
            ele.data.dom = createNodeDomElement(id, content);
          }
        });
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

    let isTapHoldTriggered = false;

    cy.current.domNode();

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
    cy.current.contextMenus(contextMenuOptions);

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
      if (isTapHoldTriggered) {
        isTapHoldTriggered = !isTapHoldTriggered;
        return;
      }
      const node = evt.target;
      node.select();
      const targetId = evt.target.data("id");
      showInput(targetId);

      function showInput(id: string) {
        // Get the div element
        const outputDiv = document.getElementById(id);
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
          ).value;
          if (outputDiv?.childElementCount)
            outputDiv?.removeChild(inputElement);
        });
      }
    });
    let nodeid = 1;
    cy.current.on("taphold", "node", (evt) => {
      isTapHoldTriggered = true;
      const currentNodeId = nodeid++;
      const targetId = evt.target.data("id"); //cy.nodes()[Math.floor(Math.random() * cy.nodes().length)].data('id')

      const div = createNodeDomElement(
        `node-${currentNodeId.toString()}`,
        `node-${currentNodeId}`
      );
      // document.createElement("div");
      // div.setAttribute("id", `node-${currentNodeId.toString()}`);
      // div.innerHTML = `node-${currentNodeId}`;
      // div.style.minWidth = "min-content";
      // div.style.maxWidth = "max-content";
      // div.style.textAlign = "center";
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

          const edges = (cy.current?.json() as Current).elements.edges;
          const nodes = (cy.current?.json() as Current).elements.nodes;
          const nData = [...edges, ...nodes];
          console.log("json", nData);
          // console.log("working");
          nData.forEach((ndata) => {
            if (ndata.data.dom) {
              const divData = {
                id: ndata.data.dom.id,
                content: ndata.data.dom.innerHTML,
              };
              ndata.data.dom = divData;
            }
          });

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
