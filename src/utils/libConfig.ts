import cytoscape from "cytoscape";

export const cystoConfig = {
  style: cytoscape
    .stylesheet()
    .selector("node")
    .style({
      label: "data(label)",
      height: 50,
      width: 50,
      "background-fit": "cover",
      "border-color": "#000",
      "border-width": 3,
      "border-opacity": 0.5,
      "text-wrap": "wrap",
      "text-halign": "center",
      "text-valign": "center",
    })
    .selector("edge")
    .style({
      width: 6,
      "target-arrow-shape": "triangle",
      "line-color": "#ffaaaa",
      "target-arrow-color": "#ffaaaa",
      "curve-style": "bezier",
    }),
  layout: {
    name: "cola",
    handleDisconnected: true,
    animate: true,
    avoidOverlap: true,
    infinite: false,
    unconstrIter: 1,
    userConstIter: 0,
    allConstIter: 1,
  },
};
