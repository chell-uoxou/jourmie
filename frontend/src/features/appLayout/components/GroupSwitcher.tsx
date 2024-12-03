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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { CreateGroup } from "~/utils/creategroup"; // createGroup関数をインポート
import { v4 as uuidv4 } from "uuid"; // ユニークなIDを生成

type Props = {
  currentGroupId: string | "personal" | null;
  onChange: (groupId: string | "personal") => void;
  groups: DBGroup[] | "loading" | null;
};

export function GroupSwitcher({ currentGroupId, groups, onChange }: Props) {
  const [openGroupSwitcher, setOpenGroupSwitcher] = useState(false);
  const [isCGOpen, setIsCGOpen] = useState(false);
  const handleOpen = () => setIsCGOpen(true);
  const handleClose = () => setIsCGOpen(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupIcon, setGroupIcon] = useState<File | null>(null);

  const handleCreateGroup = async () => {
    if (!groupName) {
      alert("グループ名を入力してください");
      return;
    }

    const newGroupId = uuidv4(); // ユニークなIDを生成
    const iconUrl = "/images/defaulticon.png"; // デフォルトアイコン

    try {
      await CreateGroup(newGroupId, {
        name: groupName,
        description: groupDescription,
        icon_url: iconUrl,
      });

      alert("グループが作成されました");
      handleClose();
      onChange(newGroupId); // 新しいグループに切り替え
    } catch (error) {
      console.error("グループ作成中にエラーが発生しました:", error);
      alert("グループ作成に失敗しました");
    }
  };

  const selectedGroup =
    groups === "loading" || groups === null || currentGroupId === null
      ? null
      : groups.find((group) => group.uid === currentGroupId);

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
                        src={
                          selectedGroup?.icon_url ?? "/images/defaulticon.png"
                        }
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
                url={`/g/${selectedGroup.uid}/member?invite=true`}
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
          <DropdownMenuItem onSelect={handleOpen} className="font-bold">
            <CirclePlus className="mr-2 h-4 w-4" />
            新規作成
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isCGOpen}
        onOpenChange={setIsCGOpen}
        aria-label="Create Group"
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>グループを作成</DialogTitle>
            <DialogDescription>
              アイコン、グループ名、説明を入力してください
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex flex-col gap-y-3">
            <div>
              <WithLabel label="アイコン">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGroupIcon(e.target.files?.[0] ?? null)}
                />
              </WithLabel>
            </div>
            <div>
              <InputWithLabel
                label="グループ名"
                id="name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div>
              <WithLabel label="説明">
                <Textarea
                  id="memo"
                  className="h-24"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                />
              </WithLabel>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateGroup}>
              保存
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
