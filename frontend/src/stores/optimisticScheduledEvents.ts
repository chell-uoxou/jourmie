import { atom } from "jotai";
import { DraggableEventData } from "~/features/dayTimeline/components/DayTimelineScheduledEvent";

export type OptimisticScheduledEvent = DraggableEventData & {
  groupId: string;
  isSyncedWithDB: boolean; // DBと同期済みかどうか。追加中、Optimisticな状態ではfalse。
};

export type OptimisticScheduledEvents = OptimisticScheduledEvent[];

export const optimisticScheduledEventsAtom = atom<OptimisticScheduledEvents>(
  []
);
