"use client";

import { getAuth, signOut } from "firebase/auth";
import { GroupSwitcher } from "./components/GroupSwitcher";
import { LogoIcon } from "~/components/common/LogoIcon";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { useEffect, useState } from "react";
import MyAvatar from "./components/MyAvatar";
import { Bell, LogOut, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DBGroup } from "~/lib/firestore/schemas";
import useGroupRouter from "~/hooks/useGroupRouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export const AppTopBar = () => {
  const [groups, setGroups] = useState<DBGroup[] | null | "loading">("loading");
  const { currentDBAccount, getGroupsByAccount } = useCurrentAccount(true);
  const { isInGroup, groupId, pushToChangeGroup } = useGroupRouter();

  useEffect(() => {
    if (currentDBAccount === "loading" || currentDBAccount === null) return;

    getGroupsByAccount(currentDBAccount).then((groups) => {
      setGroups(groups);
    });
  }, [currentDBAccount, getGroupsByAccount]);

  const router = useRouter();
  const auth = getAuth();
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/account/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex justify-between items-center h-14 px-6 py-2 border-b border-brand-border-color absolute w-screen">
      <GroupSwitcher
        currentGroupId={isInGroup ? groupId : "personal"}
        groups={groups}
        onChange={(groupId) => {
          pushToChangeGroup(groupId);
        }}
      />
      <div className="flex w-22 h-5.5">
        <LogoIcon />
      </div>
      <div className="flex flex-row-reverse w-[200px] items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MyAvatar />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Settings />
              設定
            </DropdownMenuItem>
            <DropdownMenuItem >
              <LogOut />
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="size-8">
          <Bell size={20} />
        </Button>
      </div>
    </div>
  );
};
