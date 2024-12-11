import { ClientRect, DragStartEvent, Modifier } from "@dnd-kit/core";
import { Props } from "@dnd-kit/core/dist/components/DndContext/DndContext";
import { UIEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { ScheduleEvent } from "../components/DayTimelineSchedule";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";

interface UseDndEditInTimelineOptions {
  onChangeStartTime?: (
    startMinute: number,
    scheduleEvent: ScheduleEvent
  ) => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export const useDndEditInTimeline = (options: UseDndEditInTimelineOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeScheduleEvent, setActiveScheduleEvent] =
    useState<ScheduleEvent | null>(null);
  const { timelineSettings } = useTimelineSettings();
  const scrollAreaRect = useRef<ClientRect | null>(null);
  const scrollTopInDayTimeline = useRef<number | null>(null);
  const [quantizedMinutesFromMidnight, setQuantizedMinutesFromMidnight] =
    useState<number>(0);

  const handleStartDrag = useCallback((event: DragStartEvent) => {
    console.log(
      "Start dragging as edit in timeline: ",
      event.active.data.current?.schedule
    );
    setActiveId(String(event.active.id));
    setActiveScheduleEvent(event.active.data.current?.schedule);
  }, []);

  const scheduleItemModifier: Modifier = useCallback(
    (args) => {
      scrollAreaRect.current =
        options.scrollAreaRef.current?.getBoundingClientRect() ?? null;

      let modifiedTransform = args.transform;

      const topInDayTimeline =
        (args.activeNodeRect?.top ?? 0) + // ドラッグ前の小さいイベントブロックのtop位置
        args.transform.y + // ドラッグ中のイベントブロックのyデルタ
        (scrollTopInDayTimeline.current ?? 0) - // スクロールエリアのスクロール量
        (scrollAreaRect.current?.top ?? 0) - // スクロールエリアのtop位置
        24; // タイムライングリッドの上部の余白

      let minutesFromMidnight = Math.floor(
        (topInDayTimeline / timelineSettings.gridHeight) *
          timelineSettings.gridInterval *
          60
      );

      minutesFromMidnight =
        minutesFromMidnight <= 0
          ? 0
          : minutesFromMidnight >= 1440
          ? 1440
          : minutesFromMidnight;

      setQuantizedMinutesFromMidnight(
        Math.floor(minutesFromMidnight / 15) * 15
      );

      modifiedTransform = {
        ...modifiedTransform,
        x: 0, // ずらさない
        y:
          (quantizedMinutesFromMidnight / 60) * timelineSettings.gridHeight -
          (scrollTopInDayTimeline.current ?? 0) -
          (args.activeNodeRect?.top ?? 0) +
          (scrollAreaRect.current?.top ?? 0) +
          24,
      };
      return modifiedTransform;
    },
    [
      options.scrollAreaRef,
      quantizedMinutesFromMidnight,
      timelineSettings.gridHeight,
      timelineSettings.gridInterval,
    ]
  );

  const dndContextProps: Props = useMemo(() => {
    return {
      modifiers: [scheduleItemModifier],
      onDragStart: handleStartDrag,
    };
  }, [handleStartDrag, scheduleItemModifier]);

  const handleScroll: UIEventHandler = (e) => {
    if (e) {
      scrollTopInDayTimeline.current = e.currentTarget.scrollTop;
    }
  };

  return {
    dndContextProps,
    activeId,
    activeScheduleEvent,
    quantizedMinutesFromMidnight,
    handleScroll,
  };
};
