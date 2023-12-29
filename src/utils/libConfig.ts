import { createClient } from "@supabase/supabase-js";
import cytoscape from "cytoscape";

export const cytoDepthColor = [
  "#5F0F40",
  "#5F0F40",
  "#FB8B24",
  "#E36414",
  "#9A031E",
  "#F90716",
  "#FF5403",
  "#864000",
  "#D44000",
  "#FF7A00",
  "#DBC",
  "#EAE",
  "#C3E",
];

export const cytoStyle = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      label: "data(label)",
      height: 50,
      width: 150,
      color: "black",

      "background-color": "white",
      "border-color": "#3081D0",
      "border-width": 3,
      "border-radius": "14px",
      "font-size": "25px",

      "text-halign": "center",
      "text-valign": "center",
    },
  },
  {
    selector: ":parent",
    style: {
      label: "",
      "background-color": "lightgray", // this makes the compound node's rectangle visible
      "border-color": "#3081df",
    },
  },
  {
    selector: "edge",
    style: {
      width: 6,
      // "target-arrow-shape": "triangle",
      "line-color": "#ffaaaa",
      "target-arrow-color": "#ffaaaa",
      // "curve-style": "bezier",
    },
  },
  {
    selector: "node.tmp",
    style: {
      // "border-color": "lightgray",
    },
  },
];

export const cystoConfig = {
  style: cytoscape
    .stylesheet()
    .selector("node")
    .style({
      shape: "rectangle",
      label: "data(label)",
      height: 50,
      width: 200,
      color: "white",

      "border-color": "#3081D0",
      "border-width": 3,
      "border-radius": 0,

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
    })
    .selector(":parent") // this selects compound nodes (i.e., nodes that have children)
    .css({
      label: "",
      // "background-color": "#afdfff", // this makes the compound node's rectangle visible
    }),
  layout: {
    name: "fcose",
  },
};

export const expandCollapseOptions = {
  // layoutBy: {
  //   name: "fcose",
  //   randomize: false,
  //   fit: true,
  // },
  // undoable: true,
  // animate: true,
  // animationDuration: 100,
  // fisheye: true,
};

export const contextMenuOptions = {
  // Customize event to bring up the context menu
  // Possible options https://js.cytoscape.org/#events/user-input-device-events
  evtType: "cxttap",
  // List of initial menu items
  // A menu item must have either onClickFunction or submenu or both
  menuItems: [
    {
      id: "edit",
      content: "edit",
      tooltipText: "edit",
      image: { src: "add.svg", width: 12, height: 12, x: 6, y: 4 },
      selector: "node",
      coreAsWell: true,
      onClickFunction: function () {
        console.log("edit node");
      },
    },
    {
      id: "remove", // ID of menu item
      content: "remove", // Display content of menu item
      tooltipText: "remove", // Tooltip text for menu item
      image: { src: "remove.svg", width: 12, height: 12, x: 6, y: 4 }, // menu icon
      // Filters the elements to have this menu item on cxttap
      // If the selector is not truthy no elements will have this menu item on cxttap
      selector: "node, edge",
      onClickFunction: function () {
        // The function to be executed on click
        console.log("remove element");
      },
      disabled: false, // Whether the item will be created as disabled
      // show: false, // Whether the item will be shown or not
      hasTrailingDivider: true, // Whether the item will have a trailing divider
      coreAsWell: true, // Whether core instance have this item on cxttap
      submenu: [], // Shows the listed menuItems as a submenu for this item. An item must have either submenu or onClickFunction or both.
    },
  ],
  // css classes that menu items will have
  menuItemClasses: [
    // add class names to this list
  ],
  // css classes that context menu will have
  contextMenuClasses: [
    // add class names to this list
  ],
  // Indicates that the menu item has a submenu. If not provided default one will be used
  submenuIndicator: {
    src: "assets/submenu-indicator-default.svg",
    width: 12,
    height: 12,
  },
};

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);
