"use client";

import { FormEventHandler, useState } from "react";
import { InputWithLabel } from "~/components/common/InputWithLabel";
import { WithLabel } from "~/components/common/WithLabel";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useCurrentGroup from "~/hooks/useCurrentGroup";
import { GroupMemberPermissionPreset } from "~/models/types/permission";
import { PermissionDescriptions } from "./PermissionDescriptions";
import PermissionSelector from "./PermissionSelector";

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
          <PermissionSelector
            permissionPreset={permPreset}
            onChange={setPermPreset}
          />
          <PermissionDescriptions presetName={permPreset} />
        </WithLabel>
        <div className="flex justify-end">
          <Button type="submit">招待</Button>
        </div>
      </form>
    </DialogContent>
  );
};