import { createContext, useContext } from "react";

type SharedInputsRefContextType = {
  mapWidgetInputRef: React.MutableRefObject<HTMLInputElement | null>;
  redirectInputRef: React.MutableRefObject<HTMLInputElement | null>;
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

  const focusMapSearchBox = (value: string | undefined = undefined) => {
    if (value) {
      _mapWidgetInputRef.current!.value = value;
    }
    _mapWidgetInputRef.current?.focus();
  };

  const _focusRedirectSearchBox = (value: string | undefined = undefined) => {
    if (value) {
      redirectInputRef.current!.value = value;
    }
    redirectInputRef.current?.focus();
  };

  return {
    focusMapSearchBox,
    redirectInputRef,
    _focusRedirectSearchBox,
    _mapWidgetInputRef,
  };
};
