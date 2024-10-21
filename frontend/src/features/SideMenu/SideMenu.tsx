"use client";

import React from "react";
import SideMenuItemWithIcon from "./components/SideMenuItemWithIcon";
import Heading from "./components/Heading";
import Border from "./components/Border";
import { Flower2 } from "lucide-react";
import { UsersRound } from "lucide-react";
import { SquareCheckBig } from "lucide-react";
import { PiggyBank } from "lucide-react";
import { UserRound } from "lucide-react";
import { List } from "lucide-react";
import { Blocks } from "lucide-react";
import { Calendar } from "lucide-react";
import { StickyNote } from "lucide-react";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { LoadingSpinner } from "~/components/ui/spinner";
import useGroupRouter from "~/hooks/useGroupRouter";
import { useRouter } from "next/navigation";

function SideMenu() {
  const { isInGroup, pushInGroup, getPathInGroup } = useGroupRouter();
  const { push } = useRouter();
  const dbGroup = useCurrentGroup();
  return (
    <div className="flex flex-col gap-2">
      {isInGroup && (
        <>
          {dbGroup === "loading" ? (
            <LoadingSpinner className="size-4 m-2" />
          ) : (
            <Heading title={dbGroup?.name.toUpperCase() ?? "no group found!"} />
          )}
          <SideMenuItemWithIcon
            icon={<Flower2 className="size-5" />}
            title="概要"
            onClick={() => {
              pushInGroup("/");
            }}
            isSelected={getPathInGroup() === "/"}
          />
          <SideMenuItemWithIcon
            icon={<UsersRound className="size-5" />}
            title="メンバー"
            onClick={() => {
              pushInGroup("/member");
            }}
            isSelected={getPathInGroup() === "/member"}
          />
          <SideMenuItemWithIcon
            icon={<SquareCheckBig className="size-5" />}
            title="やること"
            onClick={() => {
              pushInGroup("/tasks");
            }}
            isSelected={getPathInGroup() === "/tasks"}
          />
          <SideMenuItemWithIcon
            icon={<PiggyBank className="size-5" />}
            title="予算"
            onClick={() => {
              pushInGroup("/budget");
            }}
            isSelected={getPathInGroup() === "/budget"}
          />
          <Border />
        </>
      )}
      {isInGroup ? (
        <Heading title="グループの予定" />
      ) : (
        <Heading title="あなたの予定" />
      )}
      <SideMenuItemWithIcon
        icon={<Blocks className="size-5" />}
        title="イベント候補"
        onClick={() => {
          pushInGroup("/event_pool");
        }}
        isSelected={getPathInGroup() === "/event_pool"}
      />
      <SideMenuItemWithIcon
        icon={<Calendar className="size-5" />}
        title="カレンダー"
        onClick={() => {
          pushInGroup("/calendar");
        }}
        isSelected={getPathInGroup() === "/calendar"}
      />
      <SideMenuItemWithIcon
        icon={<StickyNote className="size-5" />}
        title="予定メモ"
        onClick={() => {
          pushInGroup("/schedule_notes");
        }}
        isSelected={getPathInGroup() === "/schedule_notes"}
      />
      <Border />
      <Heading title="あなた" />
      <SideMenuItemWithIcon
        icon={<UserRound className="size-5" />}
        title="個人のカレンダー"
        onClick={() => {
          push("/calendar");
        }}
        isSelected={getPathInGroup() === "/calendar"}
      />
      <SideMenuItemWithIcon
        icon={<List className="size-5" />}
        title="参加しているグループ"
        onClick={() => {
          push("/groups");
        }}
        isSelected={getPathInGroup() === "/groups"}
      />
    </div>
  );
}

export default SideMenu;
