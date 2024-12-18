import { FormEventHandler, useEffect, useState } from "react";
import { WithLabel } from "~/components/common/WithLabel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DBGroupMember } from "~/lib/firestore/schemas";
import PermissionSelector from "./PermissionSelector";
import {
  getPresetByScopes,
  GroupMemberPermissionPreset,
} from "~/models/types/permission";
import { PermissionDescriptions } from "./PermissionDescriptions";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface EditMemberDialogProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  member: DBGroupMember | null;
}

const EditMemberDialog = (props: EditMemberDialogProps) => {
  const { member, ...dialogProps } = props;
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    // ここに招待処理を書く
  };

  const [permPreset, setPermPreset] = useState<
    GroupMemberPermissionPreset | "custom"
  >(getPresetByScopes(member?.editing_permission_scopes ?? []) ?? "custom");

  useEffect(() => {
    setPermPreset(
      getPresetByScopes(member?.editing_permission_scopes ?? []) ?? "custom"
    );
  }, [member]);

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{member?.display_name} を編集</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <WithLabel label="表示名">
            <Input disabled value={member?.display_name} />
          </WithLabel>
          <WithLabel label="メールアドレス">
            <Input disabled value={member?.email} />
          </WithLabel>
          <WithLabel label="権限">
            <PermissionSelector
              permissionPreset={permPreset}
              onChange={setPermPreset}
            />
          </WithLabel>
          <PermissionDescriptions presetName={permPreset} />
          <WithLabel label="メモ">
            <Input disabled value={member?.notes} />
          </WithLabel>
          <WithLabel label="アカウントID">
            <Input disabled value={member?.uid} />
          </WithLabel>
          <div className="flex justify-end">
            <Button type="submit">保存</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
