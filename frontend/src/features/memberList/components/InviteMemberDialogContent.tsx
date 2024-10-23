"use client";

import { Blend, Eye, Shapes, ShieldCheck } from "lucide-react";
import { FormEventHandler, ReactNode, useState } from "react";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { GroupMemberPermissionPreset } from "~/models/types/permission";
import { PermissionDescriptions } from "./PermissionDescriptions";

interface InviteMemberDialogContentProps {
  group: ReturnType<typeof useCurrentGroup>;
}

export const InviteMemberDialogContent = ({
  group,
}: InviteMemberDialogContentProps) => {
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    // ここに招待処理を書く
  };
  const [permPreset, setPermPreset] = useState<GroupMemberPermissionPreset>(
    "can-edit-all-schedule"
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>メンバーを招待</DialogTitle>
        <DialogDescription>
          {(group !== "loading" ? group?.name : "グループ") +
            "に招待したいメンバーのメールアドレスを入力してください。"}
        </DialogDescription>
      </DialogHeader>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <InputWithLabel label="メールアドレス" type="email" required />
        <WithLabel label="権限">
          <Select value={permPreset} onValueChange={setPermPreset}>
            <SelectTrigger>
              <SelectValue placeholder="権限設定を選択" />
            </SelectTrigger>
            <SelectContent>
              <PermissionSelectItem
                presetName="cannot-edit"
                label="閲覧のみ"
                icon={<Eye className="size-4" />}
              />
              <PermissionSelectItem
                presetName="can-edit-open-schedule"
                label="みんなの予定だけ編集可"
                icon={<Shapes className="size-4" />}
              />
              <PermissionSelectItem
                presetName="can-edit-all-schedule"
                label="全ての予定と候補を編集可"
                icon={<Blend className="size-4" />}
              />
              <PermissionSelectItem
                presetName="admin"
                label="管理者"
                icon={<ShieldCheck className="size-4" />}
              />
            </SelectContent>
          </Select>
        </WithLabel>
        <PermissionDescriptions presetName={permPreset} />
        <div className="flex justify-end">
          <Button type="submit">招待</Button>
        </div>
      </form>
    </DialogContent>
  );
};

interface PermissionSelectItemProps {
  presetName: GroupMemberPermissionPreset;
  label: string;
  icon?: ReactNode;
}

const PermissionSelectItem = (props: PermissionSelectItemProps) => {
  return (
    <SelectItem value={props.presetName}>
      <div className="flex gap-2.5 items-center w-full justify-between">
        <div className="flex gap-3.5 items-center">
          {props.icon ? props.icon : null}
          {/* <PermissionIcons permissionPreset={props.presetName} /> */}
          {props.label}
        </div>
      </div>
    </SelectItem>
  );
};
