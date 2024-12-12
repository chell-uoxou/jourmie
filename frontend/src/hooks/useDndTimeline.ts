import {
  ClientRect,
  DragOverEvent,
  DragStartEvent,
  Modifier,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { UIEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import { DBEventPoolItem } from "~/lib/firestore/utils";

interface UseDndTimeLineOptions {
  onDropNewSchedule?: (
    startMinute: number,
    eventPoolItem: DBEventPoolItem
  ) => void;
}

export const useDndTimeline = (options: UseDndTimeLineOptions = {}) => {
  const { onDropNewSchedule } = options;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeEventPoolItem, setActiveEventPoolItem] =
    useState<DBEventPoolItem | null>(null);
  const [isOverDraggable, setIsOverDraggable] = useState(false);
  const modifierRef = useRef<Parameters<Modifier>[0] | null>(null); // デバッグ用
  const { timelineSettings } = useTimelineSettings();
  const topInDayTimeline = useRef<number | null>(null);
  const scrollTopInDayTimeline = useRef<number | null>(null);
  const minutesFromMidnight = useRef<number | null>(null);
  const [quantizedMinutesFromMidnight, setQuantizedMinutesFromMidnight] =
    useState<number>(0);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRect = useRef<ClientRect | null>(null);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleStartDrag = useCallback(
    (event: DragStartEvent) => {
      console.log(
        "Start dragging: ",
        event.active.data.current?.eventPoolItem.title
      );
      setActiveId(String(event.active.id));
      setActiveEventPoolItem(event.active.data.current?.eventPoolItem);
    },
    [setActiveId]
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    console.log("drag over");
    console.log(event);
    if (event.over === null) {
      setIsOverDraggable(false);
    } else {
      setIsOverDraggable(true);
    }
  }, []);

  const handleDragCancel = () => {
    console.log("drag cancel");
    setIsOverDraggable(false);
  };

  const handleDragEnd = useCallback(() => {
    const minute = quantizedMinutesFromMidnight;
    if (isOverDraggable && activeEventPoolItem) {
      console.log("Drag Ended: ", activeEventPoolItem?.title, minute, activeId);
      if (onDropNewSchedule && minute !== null) {
        onDropNewSchedule(minute, activeEventPoolItem);
      }
    } else {
      console.log("Drag Ended without drop: ", activeId);
    }
    setIsOverDraggable(false);
  }, [
    activeEventPoolItem,
    activeId,
    isOverDraggable,
    onDropNewSchedule,
    quantizedMinutesFromMidnight,
  ]);

  const eventItemModifier: Modifier = useCallback(
    (args) => {
      let modifiedTransform = args.transform;

      if (scrollAreaRef.current) {
        scrollAreaRect.current = scrollAreaRef.current.getBoundingClientRect();
      }

      modifierRef.current = args;

      if (args.over && args.over.id === "droppable-timeline") {
        topInDayTimeline.current =
          (args.overlayNodeRect?.top ?? 0) + // ドラッグ前の小さいイベントブロックのtop位置
          args.transform.y + // ドラッグ中のイベントブロックのyデルタ
          (scrollTopInDayTimeline.current ?? 0) - // スクロールエリアのスクロール量
          (scrollAreaRect.current?.top ?? 0) - // スクロールエリアのtop位置
          24; // タイムライングリッドの上部の余白

        minutesFromMidnight.current = Math.floor(
          (topInDayTimeline.current / timelineSettings.gridHeight) *
            timelineSettings.gridInterval *
            60
        );

        minutesFromMidnight.current =
          minutesFromMidnight.current <= 0
            ? 0
            : minutesFromMidnight.current >= 1440
            ? 1440
            : minutesFromMidnight.current;

        setQuantizedMinutesFromMidnight(
          Math.floor(minutesFromMidnight.current / 15) * 15
        );

        modifiedTransform = {
          ...modifiedTransform,
          x: (scrollAreaRect.current?.left ?? 200) - 24 + 60, // グリッドの左端から60px右にずらす
          y:
            (quantizedMinutesFromMidnight / 60) * timelineSettings.gridHeight -
            (scrollTopInDayTimeline.current ?? 0) -
            (args.overlayNodeRect?.top ?? 0) +
            (scrollAreaRect.current?.top ?? 0) +
            24,
        };
      }
      return modifiedTransform;
    },
    [
      quantizedMinutesFromMidnight,
      timelineSettings.gridHeight,
      timelineSettings.gridInterval,
    ]
  );

  const dndContextProps = useMemo(() => {
    return {
      modifiers: [eventItemModifier],
      onDragStart: handleStartDrag,
      onDragOver: handleDragOver,
      onDragCancel: handleDragCancel,
      onDragEnd: handleDragEnd,
      sensors: sensors,
    };
  }, [
    eventItemModifier,
    handleStartDrag,
    handleDragOver,
    handleDragEnd,
    sensors,
  ]);

  const onScrollDroppableArea: UIEventHandler = useCallback((e) => {
    scrollTopInDayTimeline.current = e.currentTarget.scrollTop;
  }, []);

  return {
    dndContextProps,
    activeId,
    isOverDraggable,
    modifierRef,
    onScrollDroppableArea,
    minutesFromMidnight,
    topInDayTimeline,
    quantizedMinutesFromMidnight,
    scrollAreaRef,
    activeEventPoolItem,
  };
};
