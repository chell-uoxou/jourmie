"use client";
import { ViewerLeftSideBar } from "~/features/leftSidebar/ViewerLeftSidebar";

export default function Page() {
  return (
    <div className="flex w-2/3 h-screen">
      <ViewerLeftSideBar title="カレンダー" subTitle="あなたの" />
    </div>
  );
}
