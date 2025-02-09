import { createContext, useContext } from "react";
import { Location } from "~/features/googleMap/types/location";

export type SharedInputsRefContextType = {
  mapWidgetInputRef: React.MutableRefObject<HTMLInputElement | null>;
  redirectInputRef: React.MutableRefObject<HTMLInputElement | null>;
  redirectHandler: React.MutableRefObject<(location: Location) => void | null>;
};

export const SharedInputsRefContext =
  createContext<SharedInputsRefContextType | null>(null);

interface FocusRedirectSearchBoxOptions {
  value?: string;
  location?: Location;
}

export const useMapWidget = () => {
  const context = SharedInputsRefContext;
  const inputsRef = useContext(context);

  if (!inputsRef) {
    throw new Error("useMapWidget must be used within a MapWidgetProvider");
  }

  const { mapWidgetInputRef: _mapWidgetInputRef, redirectInputRef } = inputsRef;

  const setRedirectHandler = (handler: (location: Location) => void) => {
    inputsRef.redirectHandler.current = handler;
  };

  const focusMapSearchBox = (value: string | undefined = undefined) => {
    if (value) {
      _mapWidgetInputRef.current!.value = value;
    }
    _mapWidgetInputRef.current?.focus();
  };

  const _focusRedirectSearchBox = (options: FocusRedirectSearchBoxOptions) => {
    if (options.value) {
      redirectInputRef.current!.value = options.value;
    }
    if (options.location) {
      if (inputsRef.redirectHandler.current) {
        inputsRef.redirectHandler.current(options.location);
      } else {
        console.error("redirectHandler is not set");
      }
    }

    redirectInputRef.current?.focus();
  };

  return {
    focusMapSearchBox,
    redirectInputRef,
    setRedirectHandler,
    _focusRedirectSearchBox,
    _mapWidgetInputRef,
  };
};
