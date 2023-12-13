import { DomObject, NodeType } from "../../typings/global";
import { supabase } from "./libConfig";

export const createNodeDomElement = (id: string, content: string) => {
  const div = document.createElement("div");
  div.setAttribute("id", `${id}`);
  div.innerHTML = `${content}`;
  div.style.minWidth = "min-content";
  div.style.maxWidth = "max-content";
  div.style.textAlign = "center";
  return div;
};

export const parseToDOM = (json) => {
  if (json?.data[0]?.data) {
    console.log("d", json.data[0].data);
    json.data[0].data.forEach((ele: NodeType) => {
      if (ele.data.dom) {
        const { id, content } = ele.data.dom as DomObject;
        ele.data.dom = createNodeDomElement(id, content);
      }
    });
    return json.data[0].data;
    // setData(() => json.data[0].data);
  }
};

export const getGraphData = (id: string) => {
  const res = fetch(`${import.meta.env.VITE_API_SERVER}/daynote/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.then((res) => res.json());
};

export const showInput = (id: string, callback) => {
  // Get the div element
  const outputDiv = document.getElementById(`node-${id}`);
  if (outputDiv) {
    // Create an input element
    const inputElement = document.createElement("input");
    inputElement.type = "text";

    // Set the value of the input to the current content of the div
    (inputElement as HTMLInputElement).value = (
      outputDiv as HTMLElement
    ).innerHTML;

    // Replace the div with the input element
    // outputDiv.replaceWith(inputElement);
    outputDiv?.appendChild(inputElement);
    // Focus on the input element
    inputElement.focus();

    // Add an event listener to handle changes in the input
    inputElement.addEventListener("focusout", function (event) {
      (outputDiv as HTMLElement).innerHTML = (
        event.target as HTMLInputElement
      ).value;
      if (outputDiv?.childElementCount) outputDiv?.removeChild(inputElement);
      callback();
    });
  }
};

export const getUserId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user.id;
};
