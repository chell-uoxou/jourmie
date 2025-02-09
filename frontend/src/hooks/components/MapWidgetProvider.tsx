import { PropsWithChildren, useRef } from "react";
import {
  SharedInputsRefContext,
  SharedInputsRefContextType,
} from "../useMapWidget";

export const MapWidgetProvider = ({ children }: PropsWithChildren) => {
  const mapWidgetInputRef =
    useRef<SharedInputsRefContextType["mapWidgetInputRef"]["current"]>(null);
  const redirectInputRef =
    useRef<SharedInputsRefContextType["redirectInputRef"]["current"]>(null);
  const redirectHandler =
    useRef<SharedInputsRefContextType["redirectHandler"]["current"]>(null);

  return (
    <SharedInputsRefContext.Provider
      value={{ mapWidgetInputRef, redirectInputRef, redirectHandler }}
    >
      {children}
    </SharedInputsRefContext.Provider>
  );
};
