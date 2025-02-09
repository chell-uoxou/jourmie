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
import CreateGroupDialog from "~/features/groupCreation/CreateGroupDialog";
import useInviteDialogOpen from "~/hooks/useInviteDialogOpen";
import useGroupRouter from "~/hooks/useGroupRouter";

type Props = {
  currentGroupId: string | "personal" | null;
  onChange: (groupId: string | "personal") => void;
  groups: DBGroup[] | "loading" | null;
};

export function GroupSwitcher({ currentGroupId, groups, onChange }: Props) {
  const [openGroupSwitcher, setOpenGroupSwitcher] = useState(false);
  const [isCGOpen, setIsCGOpen] = useState(false);

  // グローバルな招待ダイアログ状態のフックを利用
  const { setIsOpen: setInviteDialogOpen } = useInviteDialogOpen();
  const { getPathInGroup, pushInGroup } = useGroupRouter();
  // currentGroupId が "personal" の場合は、専用のダミーオブジェクトを返す
  const selectedGroup = (() => {
    if (currentGroupId === "personal") {
      return {
        uid: "personal",
        name: "あなた",
        icon_url: "/images/defaulticon.png",
      };
    }
    if (groups === "loading" || groups === null || currentGroupId === null) {
      return null;
    }
    const validGroups = groups.filter((group) => group !== undefined);
    return validGroups.find((group) => group.uid === currentGroupId) || null;
  })();

  return (
    <>
      <DropdownMenu
        open={openGroupSwitcher}
        onOpenChange={setOpenGroupSwitcher}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={openGroupSwitcher}
            className="w-[200px] justify-between rounded-full"
          >
            {groups === "loading" ? (
              <LoadingSpinner />
            ) : selectedGroup === null ? (
              <div className="flex items-center">
                <UserRound className="h-6 w-6 mr-2" />
                <div className="font-bold">あなた</div>
              </div>
            ) : (
              <>
                <div className="flex items-center">
                  <Image
                    src={selectedGroup.icon_url ?? "/images/defaulticon.png"}
                    alt="group icon"
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  <div>{selectedGroup.name}</div>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          {selectedGroup && selectedGroup.uid !== "personal" && (
            <>
              <MenuItemWithIcon
                icon={<UserRoundPlus className="mr-2 h-4 w-4" />}
                title="友達を招待"
                onSelect={() => {
                  if (!getPathInGroup().includes("member")) {
                    pushInGroup("/member");
                  }
                  setInviteDialogOpen(true);
                }}
              />
              <MenuItemWithIcon
                icon={<UsersRound className="mr-2 h-4 w-4" />}
                title="メンバーリスト"
                url={`/g/${selectedGroup.uid}/member`}
              />
              <MenuItemWithIcon
                icon={<Settings className="mr-2 h-4 w-4" />}
                title="グループ設定"
                url={`/g/${selectedGroup.uid}`}
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
            {groups !== "loading" && groups !== null && groups.length > 0 ? (
              groups
                .filter((group) => group !== undefined)
                .map((group) => (
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
                      src={group.icon_url || "/images/defaulticon.png"}
                      alt={group.name || "group icon"}
                      width={24}
                      height={24}
                      className="flex mr-2"
                    />
                    {group.name}
                  </DropdownMenuItem>
                ))
            ) : (
              <DropdownMenuItem disabled>
                まだグループに参加していません。
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <MenuItemWithIcon
            icon={<List className="mr-2 h-4 w-4" />}
            title="グループ一覧"
          />
          <DropdownMenuItem
            onSelect={() => setIsCGOpen(true)}
            className="font-bold"
          >
            <CirclePlus className="mr-2 h-4 w-4" />
            新規作成
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateGroupDialog
        isDialogOpen={isCGOpen}
        setIsDialogOpen={setIsCGOpen}
        switchGroupHandler={onChange}
      />
    </>
  );
}
