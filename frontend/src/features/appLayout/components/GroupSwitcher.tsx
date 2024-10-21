"use client";
import MenuItemWithIcon from "./MenuItemWithIcon";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { LoadingSpinner } from "~/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { UserRoundPlus } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Settings } from "lucide-react";
import { CirclePlus } from "lucide-react";
import { List } from "lucide-react";
import { UserRound } from "lucide-react";
import { DBGroup } from "~/lib/firestore/schemas";
import { useState } from "react";

type Props = {
  currentGroupId: string | "personal" | null;
  onChange: (groupId: string | "personal") => void;
  groups: DBGroup[] | "loading" | null;
};

export function GroupSwitcher({ currentGroupId, groups, onChange }: Props) {
  const [openGroupSwitcher, setOpenGroupSwitcher] = useState(false);

  const selectedGroup =
    groups === "loading" || groups === null || currentGroupId === null
      ? null
      : groups.find((group) => group.uid === currentGroupId);

  return (
    <DropdownMenu open={openGroupSwitcher} onOpenChange={setOpenGroupSwitcher}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={openGroupSwitcher}
          className="w-[200px] justify-between rounded-full"
        >
          {groups === "loading" ? (
            <LoadingSpinner />
          ) : groups === null || selectedGroup === null ? null : (
            <>
              <div className="flex items-center">
                {currentGroupId === "personal" ? (
                  <>
                    <UserRound className="h-6 w-6 mr-2" />
                    <div className="font-bold">あなた</div>
                  </>
                ) : (
                  <>
                    <Image
                      src={selectedGroup?.icon_url ?? "/images/defaulticon.png"}
                      alt={"group icon"}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <div>{selectedGroup?.name}</div>
                  </>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {selectedGroup && (
          <>
            <MenuItemWithIcon
              icon={<UserRoundPlus className="mr-2 h-4 w-4" />}
              title="友達を招待"
            />
            <MenuItemWithIcon
              icon={<UsersRound className="mr-2 h-4 w-4" />}
              title="メンバーリスト"
            />
            <MenuItemWithIcon
              icon={<Settings className="mr-2 h-4 w-4" />}
              title="グループ設定"
            />
            <DropdownMenuSeparator className="border" />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={() => {
              setOpenGroupSwitcher(false);
              onChange("personal");
            }}
            className="font-bold"
          >
            <UserRound className="mr-2 h-4 w-4" />
            あなた
          </DropdownMenuItem>
          <DropdownMenuSeparator className="border" />
          <DropdownMenuLabel>参加中のグループ</DropdownMenuLabel>
          {groups === null || groups === "loading" ? null : groups.length ===
            0 ? (
            <DropdownMenuItem disabled>
              まだグループに参加していません。
            </DropdownMenuItem>
          ) : (
            groups.map((group) => (
              <DropdownMenuItem
                key={group.uid}
                onSelect={() => {
                  console.log("selected", group);
                  setOpenGroupSwitcher(false);
                  onChange(group.uid);
                }}
                className="flex"
              >
                <Image
                  src={group.icon_url}
                  alt={group.name}
                  width={24}
                  height={24}
                  className="flex mr-2"
                />
                {group.name}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        <MenuItemWithIcon
          icon={<List className="mr-2 h-4 w-4" />}
          title="グループ一覧"
        />
        <MenuItemWithIcon
          // {/* TODO:新規作成の処理を追加 */}
          icon={<CirclePlus className="mr-2 h-4 w-4" />}
          title="新規作成"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
