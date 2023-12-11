export type DomObject = {
  id: string;
  content: string;
};
export type NodeType = {
  data: {
    id: string;
    label: string;
    dom?: HTMLElement | DomObject;
  };
  position?: {
    x: number;
    y: number;
  };
};

export type EdgeType = {
  data: { id: string; source: string; target: string };
};

export type GraphType = Array<NodeType | EdgeType>;
