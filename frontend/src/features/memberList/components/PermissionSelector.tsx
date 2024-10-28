import { Blend, Eye, Shapes, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { GroupMemberPermissionPreset } from "~/models/types/permission";

interface PermissionSelectItemProps {
  presetName: GroupMemberPermissionPreset;
  label: string;
  icon?: React.ReactNode;
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

interface PermissionSelectorProps {
  permissionPreset: GroupMemberPermissionPreset;
  onChange?: (presetName: GroupMemberPermissionPreset) => void;
}

const PermissionSelector = ({
  permissionPreset,
  onChange,
}: PermissionSelectorProps) => {
  return (
    <Select value={permissionPreset} onValueChange={onChange}>
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
  );
};

export default PermissionSelector;
