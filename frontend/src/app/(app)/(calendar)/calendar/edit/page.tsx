"use client";
import {
  DragStartEvent,
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { useState } from "react";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { DayTimelineEvent } from "~/features/dayTimeline/DayTimelineEvent";
import PrivateScheduleDayTimeline from "~/features/dayTimeline/PrivateScheduleDayTimeline";
import CalendarEditSidebar from "~/features/leftSidebar/CalendarEditSidebar";
import { DBEventPoolItem } from "~/lib/firestore/utils";

export default function Page() {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [events, setEvents] = useState<DBEventPoolItem[]>([]);

  const handleStartDrag = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  return (
    <DndContext onDragStart={handleStartDrag}>
      <CardBodyWithLeftSidebar
        leftSidebar={
          <CalendarEditSidebar events={events} setEvents={setEvents} />
        }
      >
        <PrivateScheduleDayTimeline />
      </CardBodyWithLeftSidebar>
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({}),
          duration: 0,
        }}
      >
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
