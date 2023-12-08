import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import cytoscape from "cytoscape";
import { cystoConfig } from "../../utils/libConfig";
import { GraphType } from "../../../typings/global";

export default function Note() {
  const cyRef = useRef(null);
  const { noteId } = useParams();
  const [data, setData] = useState<GraphType>([]);

  useEffect(() => {
    const getData = () => {
      fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${noteId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("d", data.data);
          setData(() => data.data);
        });
    };
    // setData(() => element[Number(noteId) - 1]); // TODO: get server data
    getData();
  }, [noteId]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${noteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [data]);

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
          const nData = [
            {
              data: { id: "node3", label: "Node 3" },
              position: { x: 100, y: 200 },
            },
            {
              data: { id: "node4", label: "Node 4" },
              position: { x: 200, y: 300 },
            },
            { data: { id: "edge2", source: "node3", target: "node4" } },
          ];
          setData((prev) => {
            return [...prev];
          });
        }}
      >
        Test
      </button>
      <div ref={cyRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}
