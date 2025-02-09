import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { eventPoolFormSheetAtom } from "~/stores/eventPoolFormSheet";

export const useEventPoolFormSheet = () => {
  const [eventPoolFormSheet, setEventPoolFormSheet] = useAtom(
    eventPoolFormSheetAtom
  );

  const isOpenEventPoolFormSheet = useMemo(
    () => eventPoolFormSheet.isSheetOpen,
    [eventPoolFormSheet.isSheetOpen]
  );

  const setOpenEventPoolFormSheet = useCallback(
    (isOpen: boolean) => {
      setEventPoolFormSheet((prev) => ({
        ...prev,
        isSheetOpen: isOpen,
      }));
    },
    [setEventPoolFormSheet]
  );

  const currentEventPoolItem = useMemo(
    () => eventPoolFormSheet.currentEventPoolItem,
    [eventPoolFormSheet.currentEventPoolItem]
  );

  const setCurrentEventPoolItem = useCallback(
    (currentEventPoolItem: DBEventPoolItem) => {
      setEventPoolFormSheet((prev) => ({
        ...prev,
        currentEventPoolItem,
      }));
    },
    [setEventPoolFormSheet]
  );

  return {
    isOpenEventPoolFormSheet,
    setOpenEventPoolFormSheet,
    currentEventPoolItem,
    setCurrentEventPoolItem,
  };
};
