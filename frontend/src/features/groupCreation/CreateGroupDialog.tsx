import React, { useState } from "react";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { CreateGroup } from "~/utils/creategroup";
import useCurrentAccount from "~/hooks/useCurrentAccount";
import { isReady } from "~/lib/firestore/utils";

interface CreateGroupDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  switchGroupHandler: (groupId: string) => void;
}

const CreateGroupDialog = (props: CreateGroupDialogProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupIcon, setGroupIcon] = useState<File | null>(null);
  const { currentDBAccount } = useCurrentAccount();

  const handleCreateGroup = async () => {
    if (!groupName) {
      alert("グループ名を入力してください");
      return;
    }

    if (!isReady(currentDBAccount)) {
      throw new Error("アカウント情報が取得できていません");
      return;
    }

    const sendData: Parameters<typeof CreateGroup>[0] = {
      name: groupName,
      description: groupDescription,
    };

    try {
      const newGroupRef = await CreateGroup(
        sendData,
        currentDBAccount,
        groupIcon ?? undefined
      );

      alert("グループが作成されました");
      props.setIsDialogOpen(false);
      props.switchGroupHandler(newGroupRef!.id);

      // 入力内容のリセット
      setGroupName("");
      setGroupDescription("");
      setGroupIcon(null);
    } catch (error) {
      console.error("グループ作成中にエラーが発生しました:", error);
      alert("グループ作成に失敗しました");
    }
  };

  return (
    <Dialog
      open={props.isDialogOpen}
      onOpenChange={props.setIsDialogOpen}
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
          <Button variant="ghost" onClick={() => props.setIsDialogOpen(false)}>
            キャンセル
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
