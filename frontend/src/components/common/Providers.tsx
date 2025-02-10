"use client";
import { Provider as JotaiProvider } from "jotai";
import { PropsWithChildren } from "react";
import { MapWidgetProvider } from "~/hooks/components/MapWidgetProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <MapWidgetProvider>
      <JotaiProvider>{children}</JotaiProvider>
    </MapWidgetProvider>
  );
};

export default Providers;
