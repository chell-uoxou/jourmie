import { atom } from "jotai";
import { Schedule } from "~/models/types/schedule";

export type OptimisticSchedule = Schedule & {
  groupId: string;
  isSyncedWithDB: boolean; // DBと同期済みかどうか。追加中、Optimisticな状態ではfalse。
};

export type OptimisticSchedules = OptimisticSchedule[];

export const optimisticSchedulesAtom = atom<OptimisticSchedules>([]);
