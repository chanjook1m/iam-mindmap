import { useRef, useEffect } from "react";
import cytoscape from "cytoscape";

export default function Root() {
  const cyRef = useRef(null);

  useEffect(() => {
    const cy = cytoscape({
      container: cyRef.current,
      elements: [
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
  }, []);
  return (
    <main className="main">
      <p>일단 리스트로 보여주고 나중에 구체화</p>
      <ul className="brainwords">
        <li>33% - Frontend</li>
        <ul>
          <li>11% - React</li>
        </ul>
        <li>22% - Learning</li>
        <li>11% - German</li>
      </ul>
      <div ref={cyRef} style={{ width: "100%", height: "400px" }}></div>
    </main>
  );
}
