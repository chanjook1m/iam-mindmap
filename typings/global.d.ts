type NodeType = {
  data: {
    id: string;
    label: string;
  };
  position: {
    x: number;
    y: number;
  };
};

type EdgeType = {
  data: { id: string; source: string; target: string };
};

export type GraphType = Array<NodeType | EdgeType>;
