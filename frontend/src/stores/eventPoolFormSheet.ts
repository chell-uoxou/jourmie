import { atom } from "jotai";
import { DBEventPoolItem } from "~/lib/firestore/utils";

export type EventPoolFormSheet = {
  isSheetOpen: boolean;
  currentEventPoolItem: DBEventPoolItem | null; // nullの場合は新規作成
};

export const eventPoolFormSheetAtom = atom<EventPoolFormSheet>({
  isSheetOpen: false,
  currentEventPoolItem: null,
});
