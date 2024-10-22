"use client";
import { CardBodyWithLeftSidebar } from "~/features/appLayout/CardBodyWithLeftSidebar";
import { ViewerLeftSideBar } from "~/features/leftSidebar2/ViewerLeftSidebar";

export default function Page() {
  return (
    <CardBodyWithLeftSidebar
      leftSidebar={<ViewerLeftSideBar title="カレンダー" subTitle="あなたの" />}
    >
      <div>カレンダー</div>
    </CardBodyWithLeftSidebar>
  );
}
