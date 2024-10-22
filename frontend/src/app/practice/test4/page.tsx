"use client";
import { ViewerLeftSideBar } from "~/features/leftSidebar2/ViewerLeftSidebar";

export default function Page() {
  return (
    <div className="flex w-2/3 h-screen">
      <ViewerLeftSideBar title="カレンダー" subTitle="あなたの" />
    </div>
  );
}
