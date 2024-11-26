import { atom } from "jotai";
import { ScheduleEvent } from "~/features/dayTimeline/components/DayTimelineSchedule";

export type OptimisticSchedule = ScheduleEvent & {
  groupId: string;
  isSyncedWithDB: boolean; // DBと同期済みかどうか。追加中、Optimisticな状態ではfalse。
};

export type OptimisticSchedules = OptimisticSchedule[];

export const optimisticSchedulesAtom = atom<OptimisticSchedules>([]);
