import { createContext, useContext } from "react";
import { Location } from "~/features/googleMap/types/location";

interface FocusRedirectSearchBoxOptions {
  value: string | null;
  location: Location;
}
export type SharedInputsRefContextType = {
  mapWidgetInputRef: React.MutableRefObject<HTMLInputElement | null>;
  redirectInputRef: React.MutableRefObject<HTMLInputElement | null>;
  redirectHandler: React.MutableRefObject<
    (options: Required<FocusRedirectSearchBoxOptions>) => void | null
  >;
};

export const SharedInputsRefContext =
  createContext<SharedInputsRefContextType | null>(null);

export const useMapWidget = () => {
  const context = SharedInputsRefContext;
  const inputsRef = useContext(context);

  if (!inputsRef) {
    throw new Error("useMapWidget must be used within a MapWidgetProvider");
  }

  const { mapWidgetInputRef: _mapWidgetInputRef, redirectInputRef } = inputsRef;

  const setRedirectHandler = (
    handler: (options: FocusRedirectSearchBoxOptions) => void
  ) => {
    inputsRef.redirectHandler.current = handler;
  };

  const focusMapSearchBox = (value: string | undefined = undefined) => {
    if (value) {
      _mapWidgetInputRef.current!.value = value;
    }
    _mapWidgetInputRef.current?.focus();
  };

  const _redirectSearchBox = (options: FocusRedirectSearchBoxOptions) => {
    if (options.location && options.value) {
      if (inputsRef.redirectHandler.current) {
        inputsRef.redirectHandler.current(options);
      } else {
        console.error("redirectHandler is not set");
      }
    } else {
      console.error("location or value is not set");
    }

    redirectInputRef.current?.focus();
  };

  return {
    focusMapSearchBox,
    redirectInputRef,
    setRedirectHandler,
    _redirectSearchBox,
    _mapWidgetInputRef,
  };
};
