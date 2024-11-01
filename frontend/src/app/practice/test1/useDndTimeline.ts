import {
  ClientRect,
  DragOverEvent,
  DragStartEvent,
  Modifier,
} from "@dnd-kit/core";
import { UIEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { useTimelineSettings } from "~/hooks/useTimelineSettings";
import { DBEventPoolItem } from "~/lib/firestore/utils";

export const useDndTimeline = () => {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [activeEventPoolItem, setActiveEventPoolItem] =
    useState<DBEventPoolItem | null>(null);
  const [isOverDraggable, setIsOverDraggable] = useState(false);
  const modifierRef = useRef<Parameters<Modifier>[0] | null>(null); // デバッグ用
  const { timelineSettings } = useTimelineSettings();
  const topInDayTimeline = useRef<number | null>(null);
  const scrollTopInDayTimeline = useRef<number | null>(null);
  const minutesFromMidnight = useRef<number | null>(null);
  const quantizedMinutesFromMidnight = useRef<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRect = useRef<ClientRect | null>(null);

  const handleStartDrag = useCallback(
    (event: DragStartEvent) => {
      console.log(
        "Start dragging: ",
        event.active.data.current?.eventPoolItem.title
      );
      setActiveId(event.active.id);
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
    const minute = quantizedMinutesFromMidnight.current;
    if (isOverDraggable && activeEventPoolItem) {
      console.log("Drag Ended: ", activeEventPoolItem?.title, minute, activeId);
    } else {
      console.log("Drag Ended without drop: ", activeId);
    }
    setIsOverDraggable(false);
  }, [activeEventPoolItem, activeId, isOverDraggable]);

  const setScrollAreaRef = useCallback((node: HTMLDivElement | null) => {
    scrollAreaRef.current = node;
    if (node) {
      scrollAreaRect.current = node.getBoundingClientRect();
    }
  }, []);

  const eventItemModifier: Modifier = useCallback(
    (args) => {
      let modifiedTransform = args.transform;

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

        quantizedMinutesFromMidnight.current =
          Math.floor(minutesFromMidnight.current / 15) * 15;

        modifiedTransform = {
          ...modifiedTransform,
          x: (scrollAreaRect.current?.left ?? 200) - 24 + 60,
          y:
            (quantizedMinutesFromMidnight.current / 60) *
              timelineSettings.gridHeight -
            (scrollTopInDayTimeline.current ?? 0) -
            (args.overlayNodeRect?.top ?? 0) +
            (scrollAreaRect.current?.top ?? 0) +
            24,
        };
      }
      return modifiedTransform;
    },
    [timelineSettings.gridHeight, timelineSettings.gridInterval]
  );

  const dndContextProps = useMemo(() => {
    return {
      modifiers: [eventItemModifier],
      onDragStart: handleStartDrag,
      onDragOver: handleDragOver,
      onDragCancel: handleDragCancel,
      onDragEnd: handleDragEnd,
    };
  }, [eventItemModifier, handleStartDrag, handleDragOver, handleDragEnd]);

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
    setScrollAreaRef,
    activeEventPoolItem,
  };
};
