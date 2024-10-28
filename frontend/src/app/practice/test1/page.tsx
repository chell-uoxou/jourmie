"use client";

import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  Modifier,
  useDroppable,
} from "@dnd-kit/core";
import clsx from "clsx";
import { doc, GeoPoint, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { DayTimelineEvent } from "~/features/dayTimeline/DayTimelineEvent";
import EventPoolListItem from "~/features/eventPool/EventsPoolListItem";
import { Timeline } from "~/features/timeline/Timeline";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import { db } from "~/lib/firebase";
import { defaultConverter } from "~/lib/firestore/firestore";
import { DBAccount, DBGroupMember } from "~/lib/firestore/schemas";
import { DBEventPoolItem } from "~/lib/firestore/utils";
import { useDndTimeline } from "./useDndTimeline";
import Debug from "./components/Debug";

const Droppable = () => {
  const { timelineSettings } = useTimelineSettings();
  const { setNodeRef } = useDroppable({ id: "dnd-practice-droppable" });
  return (
    <div
      className="flex items-center justify-center rounded-lg"
      ref={setNodeRef}
    >
      <Timeline
        itemHeight={timelineSettings.gridHeight}
        interval={timelineSettings.gridInterval}
      />
    </div>
  );
};

export default function Page() {
  const [modifierState, setModifierState] = useState<
    Parameters<Modifier>[0] | null
  >(null);
  const dummyEventPool1: DBEventPoolItem = {
    uid: "1",
    title: "京都国立博物館",
    description: "特別展を見学",
    location_text: "京都府京都市東山区",
    location_coordinates: new GeoPoint(35.0116, 135.7681),
    attached_image: "",
    available_times: [
      {
        start_time: Timestamp.fromDate(new Date("2024-10-20T09:00:00")),
        end_time: Timestamp.fromDate(new Date("2024-10-20T18:00:00")),
      },
      {
        start_time: Timestamp.fromDate(new Date("2024-10-21T09:00:00")),
        end_time: Timestamp.fromDate(new Date("2024-10-21T18:00:00")),
      },
    ],
    default_duration: 0,
    default_budget: {
      mode: "per_person",
      value: 0,
    },
    needs_preparation: false,
    preparation_task: "予習",
    max_participants: 0,
    notes: "notes",
    created_by_account: doc(db, "accounts/1").withConverter(
      defaultConverter<DBAccount>()
    ),
    created_by_member: doc(db, "members/1").withConverter(
      defaultConverter<DBGroupMember>()
    ),
    schedule_instances: [],
  };
  const dummyEventPool2: DBEventPoolItem = {
    uid: "2",
    title: "京都タワー",
    description: "展望台に登る",
    location_text: "京都府京都市下京区",
    location_coordinates: new GeoPoint(34.9875, 135.7594),
    attached_image: "",
    available_times: [
      {
        start_time: Timestamp.fromDate(new Date("2024-10-20T10:00:00")),
        end_time: Timestamp.fromDate(new Date("2024-10-20T21:00:00")),
      },
      {
        start_time: Timestamp.fromDate(new Date("2024-10-21T10:00:00")),
        end_time: Timestamp.fromDate(new Date("2024-10-21T21:00:00")),
      },
    ],
    default_duration: 90,
    default_budget: {
      mode: "per_person",
      value: 900,
    },
    needs_preparation: true,
    preparation_task: "オンラインチケットの購入",
    max_participants: 0,
    notes: "",
    created_by_account: doc(db, "accounts/1").withConverter(
      defaultConverter<DBAccount>()
    ),
    created_by_member: doc(db, "members/1").withConverter(
      defaultConverter<DBGroupMember>()
    ),
    schedule_instances: [],
  };

  const {
    dndContextProps,
    modifierRef,
    onScrollDroppableArea,
    isOverDraggable,
    minutesFromMidnight,
    topInDayTimeline,
    quantizedMinutesFromMidnight,
    activeId,
  } = useDndTimeline();

  const events = [dummyEventPool1, dummyEventPool2];

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const minutesInHour = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutesInHour
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setModifierState(modifierRef.current);
    }, 100);
    return () => clearInterval(interval);
  }, [modifierRef]);

  return (
    <DndContext {...dndContextProps}>
      <div className="flex h-svh">
        <div className="p-10 flex flex-col gap-4">
          <EventPoolListItem id="1" eventPool={dummyEventPool1} />
          <EventPoolListItem id="2" eventPool={dummyEventPool2} />
        </div>
        <ScrollArea className="size-full" onScroll={onScrollDroppableArea}>
          <Droppable />
        </ScrollArea>
      </div>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({}),
          duration: 0,
        }}
        className={clsx(isOverDraggable ? "cursor-copy" : "", "relative")}
      >
        <Debug
          modifierState={modifierState}
          minutesFromMidnight={minutesFromMidnight}
          topInDayTimeline={topInDayTimeline}
          quantizedMinutesFromMidnight={quantizedMinutesFromMidnight}
          formatMinutes={formatMinutes}
        />
        {activeId ? (
          <DayTimelineEvent
            isDragging
            event={
              events.find((event) => event.uid === activeId) as DBEventPoolItem
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
