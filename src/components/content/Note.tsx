import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";
import { cystoConfig } from "../../utils/libConfig";
import { GraphType } from "../../../typings/global";

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

const element2 = [
  [
    {
      data: { id: "node1", label: "Node 1" },
      position: { x: 55, y: 55 },
    },
    {
      data: { id: "node2", label: "Node 2" },
      position: { x: 155, y: 155 },
    },
    { data: { id: "edge1", source: "node1", target: "node2" } },
  ],
  [
    {
      data: { id: "node1", label: "Node 3" },
      position: { x: 55, y: 155 },
    },
    {
      data: { id: "node2", label: "Node 4" },
      position: { x: 155, y: 255 },
    },
    { data: { id: "edge1", source: "node1", target: "node2" } },
  ],
  [
    {
      data: { id: "node1", label: "Node 5" },
      position: { x: 55, y: 55 },
    },
    {
      data: { id: "node2", label: "Node 6" },
      position: { x: 155, y: 155 },
    },
    { data: { id: "edge1", source: "node1", target: "node2" } },
  ],
];

export default function Note() {
  const cyRef = useRef(null);
  const { noteId } = useParams();
  const [data, setData] = useState<GraphType>();

  useEffect(() => {
    setData(() => element[Number(noteId) - 1]); // TODO: get server data
  }, [noteId]);

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: data,
      style: cystoConfig.style,
      layout: cystoConfig.layout,
    });

    // console.log(cy.json().elements.edges, cy.json().elements.nodes);
    return () => {
      cy.destroy();
    };
  }, [noteId, data]);

  return (
    <div style={{ height: "500px" }}>
      <button
        style={{ width: "100px", height: "100px" }}
        onClick={() => {
          setData(() => element2[Number(noteId) - 1]);
          fetch(`${import.meta.env.VITE_API_SERVER}/posts`)
            .then((res) => res.json())
            .then((data) => console.log(data));
        }}
      >
        Test
      </button>
      <div ref={cyRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
