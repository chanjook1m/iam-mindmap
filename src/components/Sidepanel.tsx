import { useDeferredValue, useEffect } from "react";
import "./sidepanel.styles.css";
import {
  onClickAdd,
  onClickDel,
  onClickEdit,
  saveToServer,
} from "../utils/utils";
import debounce from "lodash-es/debounce";

function Sidepanel({
  nodeType,
  content,
  onContentChange,
  cytoInstance,
  onCollapsed,
  textAreaRef,
}) {
  const menuItem = [
    { text: "Add", class: "add", onClick: onClickAdd },
    // { text: "Edit", class: "edit", onClick: onClickEdit },
    { text: "Del", class: "del", onClick: onClickDel },
  ];
  const deferredQuery = useDeferredValue(content);
  const debouncedEdit = debounce(() => {
    saveToServer(cytoInstance);
  }, 2000);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onCollapsed(false);
      const node = cytoInstance.nodes(":selected")[0];
      node.data("dom")?.classList.remove("selected");
    }
  };

  useEffect(() => {
    if (nodeType === "node")
      cytoInstance.nodes(":selected")[0].data("dom").textContent = content;
  }, [deferredQuery]);

  return (
    <aside className="sidepanel">
      <div
        className="close"
        onClick={(e) => {
          // cytoInstance.nodes().forEach((node) => node.ungrabify());
          onCollapsed(false);
          const node = cytoInstance.nodes(":selected")[0];
          node.data("dom")?.classList.remove("selected");
        }}
      >
        X
      </div>
      <div className="date">date</div>
      <div className="editor">
        <textarea
          autoFocus
          ref={textAreaRef}
          className="textarea"
          disabled={nodeType === "root" ? true : false}
          value={nodeType === "root" ? "" : content}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            const value = e.target.value;
            e.target.setSelectionRange(value.length, value.length);
          }}
          onChange={(e) => {
            onContentChange(e.target.value);
            debouncedEdit();
          }}
          placeholder={nodeType === "root" ? "" : "type here..."}
        />
      </div>
      <div className="options">
        {menuItem.map((menu, i) => {
          if (nodeType === "root" && i > 0) return;
          return (
            <button
              key={menu.class}
              className={menu.class}
              onClick={(e) => {
                menu.onClick(
                  e,
                  cytoInstance,
                  cytoInstance.nodes(":selected")[0]
                );
                if (menu.class === "del") onCollapsed(false);
              }}
            >
              {menu.text}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidepanel;
