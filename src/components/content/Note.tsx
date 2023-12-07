import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";

export default function Note() {
  const element = [
    [
      {
        data: { id: "node1", label: "Node 1" },
        position: { x: 100, y: 100 },
      },
      {
        data: { id: "node2", label: "Node 2" },
        position: { x: 200, y: 200 },
      },
      { data: { id: "edge1", source: "node1", target: "node2" } },
    ],
    [
      {
        data: { id: "node1", label: "Node 3" },
        position: { x: 100, y: 200 },
      },
      {
        data: { id: "node2", label: "Node 4" },
        position: { x: 200, y: 300 },
      },
      { data: { id: "edge1", source: "node1", target: "node2" } },
    ],
    [
      {
        data: { id: "node1", label: "Node 5" },
        position: { x: 100, y: 100 },
      },
      {
        data: { id: "node2", label: "Node 6" },
        position: { x: 200, y: 200 },
      },
      { data: { id: "edge1", source: "node1", target: "node2" } },
    ],
  ];
  const cyRef = useRef(null);
  const { noteId } = useParams();

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: element[Number(noteId) - 1],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#66ccff",
            label: "data(label)",
          },
        },
        {
          selector: "edge",
          style: {
            "line-color": "#ccc",
          },
        },
      ],
    });
    return () => {
      cy.destroy();
    };
  }, [element, noteId]);

  return <div ref={cyRef} style={{ width: "100%", height: "400px" }}></div>;
}
