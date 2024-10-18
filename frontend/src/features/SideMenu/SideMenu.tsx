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
// import useGroupRouter from "~/hooks/useGroupRouter";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { LoadingSpinner } from "~/components/ui/spinner";


function SideMenu() {
  // const { isInGroup } = useGroupRouter();
  const dbGroup = useCurrentGroup();
  return (
    <div>
      {dbGroup && (
        <>
          {dbGroup === "loading" ? (
            <LoadingSpinner className="size-4 m-2" />
          ) : (
            <Heading title={dbGroup.name.toUpperCase()} />
          )}
          <SideMenuItemWithIcon
            icon={<Flower2 className="size-5" />}
            title="概要"
          />
          <SideMenuItemWithIcon
            icon={<UsersRound className="size-5" />}
            title="メンバー"
          />
          <SideMenuItemWithIcon
            icon={<SquareCheckBig className="size-5" />}
            title="やること"
          />
          <SideMenuItemWithIcon
            icon={<PiggyBank className="size-5" />}
            title="予算"
          />
          <Border />
          <Heading title="グループの予定" />
          <SideMenuItemWithIcon
            icon={<Blocks className="size-5" />}
            title="イベント候補"
          />
          <SideMenuItemWithIcon
            icon={<Calendar className="size-5" />}
            title="カレンダー"
          />
          <SideMenuItemWithIcon
            icon={<StickyNote className="size-5" />}
            title="予定メモ"
          />
          <Border />
        </>
      )}
      <Heading title="あなた" />
      <SideMenuItemWithIcon
        icon={<UserRound className="size-5" />}
        title="個人のカレンダー"
      />
      <SideMenuItemWithIcon
        icon={<List className="size-5" />}
        title="参加しているグループ"
      />
    </div>
  );
}

export default SideMenu;
