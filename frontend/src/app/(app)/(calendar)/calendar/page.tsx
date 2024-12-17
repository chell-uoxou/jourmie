"use client";

import { useRef } from "react";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import PrivateScheduleDayTimeline from "~/features/dayTimeline/PrivateScheduleDayTimeline";
import { ViewerLeftSideBar } from "~/features/leftSidebar/ViewerLeftSidebar";

export default function Page() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  return (
    <CardBodyWithLeftSidebar
      leftSidebar={<ViewerLeftSideBar title="カレンダー" subTitle="あなたの" />}
    >
      <PrivateScheduleDayTimeline scrollAreaRef={scrollAreaRef} />
    </CardBodyWithLeftSidebar>
  );
}
