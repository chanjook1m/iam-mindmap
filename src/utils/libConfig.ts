export const cystoConfig = {
  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        "background-color": "#666",
        label: "data(label)",
      },
    },

    {
      selector: "edge",
      style: {
        width: 3,
        "curve-style": "bezier",
        "line-color": "#ccc",
        "source-arrow-color": "#ccc",
        "source-arrow-shape": "vee",
      },
    },
  ],
  layout: {
    name: "cose",
    animate: false,
    gravityRangeCompound: 1.5,
    fit: true,
    tile: true,
  },
};
