"use client";

import { Button } from "@/components/ui/button";
import { changeClickedElement, toggleLiveMode, togglePreviewMode } from "@/redux/slice/builderSlice";
import { RootState } from "@/redux/store";
import { EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Recursive from "./_components/recursive";
import clsx from "clsx";

type Props = {
  liveMode: boolean;
};

const Editor = ({ liveMode }: Props) => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.builder);

  useEffect(() => {
    if (liveMode) {
      dispatch(toggleLiveMode({ value: true }));
    }
  }, [liveMode]);

  // useEffect(() => {
  //     if (liveMode) {
  //       dispatch({
  //         type: 'TOGGLE_LIVE_MODE',
  //         payload: { value: true },
  //       })
  //     }
  //   }, [liveMode])

  //   //CHALLENGE: make this more performant
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const response = await getFunnelPageDetails(funnelPageId)
  //       if (!response) return

  //       dispatch({
  //         type: 'LOAD_DATA',
  //         payload: {
  //           elements: response.content ? JSON.parse(response?.content) : '',
  //           withLive: !!liveMode,
  //         },
  //       })
  //     }
  //     fetchData()
  //   }, [funnelPageId])

  const handleClick = () => {
    dispatch(changeClickedElement({ elementDetails: {} }));
  };

  const handleUnpreview = () => {
    dispatch(togglePreviewMode());
    //@ts-ignore
    dispatch(toggleLiveMode());
  };

  return (
    <div
      className={clsx("use-automation-zoom-in h-full overflow-scroll mr-[385px] bg-background transition-all rounded-md no-scrollbar", {
        "!p-0 !mr-0": state.editor.previewMode === true || state.editor.liveMode === true,
        "!w-[850px]": state.editor.device === "Tablet",
        "!w-[420px]": state.editor.device === "Mobile",
        "w-full": state.editor.device === "Desktop",
      })}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button variant={"ghost"} size={"icon"} className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]" onClick={handleUnpreview}>
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) && state.editor.elements.map((childElement) => <Recursive key={childElement.id} element={childElement} />)}
    </div>
  );
};

export default Editor;
