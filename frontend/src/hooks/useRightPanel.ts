import { atom, useAtom } from "jotai";
import { useMemo } from "react";

export type RightPanel = "map";

type RightPanelState = {
  showingPanel: RightPanel;
  isRightPanelOpen: boolean;
  hasMapRendered: boolean;
};

const rightPanelAtom = atom<RightPanelState>({
  showingPanel: "map",
  isRightPanelOpen: false,
  hasMapRendered: false,
});

export const useRightPanel = () => {
  const [rightPanelState, setRightPanelState] = useAtom(rightPanelAtom);

  const {
    showingPanel,
    isRightPanelOpen,
    hasMapRendered: hasMapRendered,
  } = useMemo(() => rightPanelState, [rightPanelState]);

  const setShowingPanel = (panel: RightPanel) => {
    setRightPanelState((prev) => ({ ...prev, showingPanel: panel }));
  };

  const setIsRightPanelOpen = (isOpen: boolean) => {
    setRightPanelState((prev) => ({ ...prev, isRightPanelOpen: isOpen }));
  };

  const setHasMapRendered = (haveRendered: boolean) => {
    setRightPanelState((prev) => ({
      ...prev,
      hasMapRendered: haveRendered,
    }));
  };

  const openMapPanel = () => {
    setShowingPanel("map");
    setIsRightPanelOpen(true);
  };

  return {
    showingPanel,
    setShowingPanel,
    isRightPanelOpen,
    setIsRightPanelOpen,
    hasMapRendered,
    setHasMapRendered,
    openMapPanel,
  };
};
