"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { changeClickedElement, deleteElement, updateElement } from "@/redux/slice/builderSlice";
import clsx from "clsx";

import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";

type Props = {
  element: EditorElement;
};

const TextComponent = (props: Props) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.builder);

  const styles = props.element.styles;

  const handleDeleteElement = () => {
    dispatch(deleteElement({ elementDetails: props.element }));
  };

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(changeClickedElement({ elementDetails: props.element }));
  };

  //WE ARE NOT ADDING DRAG DROP
  return (
    <div
      style={styles}
      className={clsx(" p-[2px] w-full relative text-[16px] transition-all", {
        "!border-blue-500": state.editor.selectedElement.id === props.element.id,

        "!border-solid": state.editor.selectedElement.id === props.element.id,
        "border-dashed border-[1px] border-slate-300 m-[3px]": !state.editor.liveMode,
      })}
      onClick={handleOnClickBody}
    >
      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
        <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">{state.editor.selectedElement.name}</Badge>
      )}
      <span
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
          const spanElement = e.target as HTMLSpanElement;
          dispatch(
            updateElement({
              elementDetails: {
                ...props.element,
                content: {
                  innerText: spanElement.innerText,
                },
              },
            })
          );
        }}
      >
        {!Array.isArray(props.element.content) && props.element.content.innerText}
      </span>
      {state.editor.selectedElement.id === props.element.id && !state.editor.liveMode && (
        <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
          <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
        </div>
      )}
    </div>
  );
};

export default TextComponent;
