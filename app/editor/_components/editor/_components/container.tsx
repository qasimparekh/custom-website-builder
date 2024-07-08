"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addElement, changeClickedElement, deleteElement } from "@/redux/slice/builderSlice";
import { v4 } from "uuid";

import clsx from "clsx";
import Recursive from "./recursive";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { defaultStyles } from "@/lib/constants";

type Props = {
  element: EditorElement;
};

const Container = ({ element }: Props) => {
  const { id, content, name, styles, type } = element;

  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.builder);

  const handleOnDrop = (e: React.DragEvent, type: string) => {
    e.stopPropagation();
    const componentType = e.dataTransfer.getData("componentType") as EditorBtns;

    switch (componentType) {
      case "text":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: { innerText: "Text Element" },
              id: v4(),
              name: "Text",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "text",
            },
          })
        );
        break;
      case "link":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: { innerText: "Link Element", href: "#" },
              id: v4(),
              name: "Link",
              styles: {
                color: "black",
                ...defaultStyles,
              },
              type: "link",
            },
          })
        );
        break;
      case "video":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: { src: "https://www.youtube.com/embed/A3l6YYkXzzg?si=zbcCeWcpq7Cwf8W1" },
              id: v4(),
              name: "Video",
              styles: {},
              type: "video",
            },
          })
        );
        break;
      case "container":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Container",
              styles: { ...defaultStyles },
              type: "container",
            },
          })
        );
        break;
      case "contactForm":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "contactForm",
            },
          })
        );
        break;
      case "paymentForm":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: [],
              id: v4(),
              name: "Contact Form",
              styles: {},
              type: "paymentForm",
            },
          })
        );
        break;
      case "2Col":
        dispatch(
          addElement({
            containerId: id,
            elementDetails: {
              content: [
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
                {
                  content: [],
                  id: v4(),
                  name: "Container",
                  styles: { ...defaultStyles, width: "100%" },
                  type: "container",
                },
              ],
              id: v4(),
              name: "Two Columns",
              styles: { ...defaultStyles, display: "flex" },
              type: "2Col",
            },
          })
        );
        break;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent, type: string) => {
    if (type === "__body") return;
    e.dataTransfer.setData("componentType", type);
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(changeClickedElement({ elementDetails: element }));
  };

  const handleDeleteElement = () => {
    dispatch(deleteElement({ elementDetails: element }));
  };

  return (
    <div
      style={styles}
      className={clsx("relative transition-all group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "h-full overflow-y-scroll overflow-x-hidden": type === "__body",
        "flex flex-col md:!flex-row": type === "2Col",
        "!border-blue-500": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body",
        "!border-yellow-400 !border-4": state.editor.selectedElement.id === id && !state.editor.liveMode && state.editor.selectedElement.type === "__body",
        "!border-solid": state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-dashed border-[1px] border-slate-300 p-3": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e, id)}
      onDragOver={handleDragOver}
      draggable={type !== "__body"}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e, "container")}
    >
      <Badge
        className={clsx("absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden", {
          block: state.editor.selectedElement.id === element.id && !state.editor.liveMode,
        })}
      >
        {element.name}
      </Badge>

      {Array.isArray(content) && content.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}

      {state.editor.selectedElement.id === element.id && !state.editor.liveMode && state.editor.selectedElement.type !== "__body" && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default Container;
