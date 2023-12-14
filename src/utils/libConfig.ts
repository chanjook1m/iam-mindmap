import { createClient } from "@supabase/supabase-js";
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
