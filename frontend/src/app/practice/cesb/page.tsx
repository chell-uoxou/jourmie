"use client";
import {
  DragStartEvent,
  DndContext,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { useState } from "react";
import { DayTimelineSchedule } from "~/features/dayTimeline/components/DayTimelineEvent";
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
      <div className="flex">
        {/* 表示部分を別コンポーネントに分離 */}
        <CalendarEditSidebar events={events} setEvents={setEvents} />

        <div className="flex-1"></div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({}),
            duration: 0,
          }}
        >
          {activeId ? (
            <DayTimelineSchedule
              isDragging
              schedule={
                events.find(
                  (event) => event.uid === activeId
                ) as DBEventPoolItem
              }
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
