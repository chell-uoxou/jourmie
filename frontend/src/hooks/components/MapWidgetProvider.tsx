import { PropsWithChildren, useRef } from "react";
import { SharedInputsRefContext } from "../useMapWidget";

export const MapWidgetProvider = ({ children }: PropsWithChildren) => {
  const mapWidgetInputRef = useRef<HTMLInputElement | null>(null);
  const redirectInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <SharedInputsRefContext.Provider
      value={{ mapWidgetInputRef, redirectInputRef }}
    >
      {children}
    </SharedInputsRefContext.Provider>
  );
};
