"use client";

import { PropsWithChildren } from "react";
import { SheetHandleButton } from "~/features/appLayout/components/SheetHandleButton";
import MapDrawer from "~/features/googleMap/MapDrawer";
import { useRightPanel } from "~/hooks/useRightPanel";

export default function Layout({ children }: PropsWithChildren) {
  const { isRightPanelOpen, setIsRightPanelOpen } = useRightPanel();

  return (
    <div className="flex gap-0 w-full h-full">
      <div className="flex-1">{children}</div>

      {!isRightPanelOpen && (
        <div className="relative flex flex-row items-center ">
          <SheetHandleButton
            direction="left"
            onClick={() => setIsRightPanelOpen(true)}
          />
        </div>
      )}

      <div className="relative flex flex-row h-full items-center">
        {isRightPanelOpen && (
          <SheetHandleButton
            direction="right"
            onClick={() => setIsRightPanelOpen(false)}
          />
        )}
        <div className="h-full bg-gray-200">
          <MapDrawer show={isRightPanelOpen} />
        </div>
      </div>
    </div>
  );
}
