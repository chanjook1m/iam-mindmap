export const element = [
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
      data: { id: "node3", label: "Node 3" },
      position: { x: 100, y: 200 },
    },
    {
      data: { id: "node4", label: "Node 4" },
      position: { x: 200, y: 300 },
    },
    { data: { id: "edge2", source: "node3", target: "node4" } },
  ],
  [
    {
      data: { id: "node5", label: "Node 5" },
      position: { x: 100, y: 100 },
    },
    {
      data: { id: "node6", label: "Node 6" },
      position: { x: 200, y: 200 },
    },
    { data: { id: "edge3", source: "node5", target: "node6" } },
  ],
];

export const element2 = [
  [
    {
      data: { id: "node1", label: "Node 1" },
    },
    {
      data: { id: "node2", label: "Node 2" },
    },
    { data: { id: "edge4", source: "node1", target: "node2" } },
  ],
  [
    {
      data: { id: "node3", label: "Node 3" },
    },
    {
      data: { id: "node4", label: "Node 4" },
    },
    { data: { id: "edge5", source: "node3", target: "node4" } },
  ],
  [
    {
      data: { id: "node5", label: "Node 5" },
    },
    {
      data: { id: "node6", label: "Node 6" },
    },
    { data: { id: "edge6", source: "node5", target: "node6" } },
  ],
];
