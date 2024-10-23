import clsx from "clsx";
import { Blend, Blocks, Shapes, Wrench } from "lucide-react";
import {
  GroupMemberPermissionPreset,
  groupMemberPermissionPreset,
  GroupMemberPermissionScope,
} from "~/models/types/permission";

interface PermissionIconsProps {
  permissionPreset: GroupMemberPermissionPreset;
}

export const PermissionIcons = ({ permissionPreset }: PermissionIconsProps) => {
  const getScopesByPreset = (preset: typeof permissionPreset) => {
    if (preset in groupMemberPermissionPreset) {
      return groupMemberPermissionPreset[preset];
    } else {
      return null;
    }
  };

  const isScopeEnabled = (
    scope: GroupMemberPermissionScope,
    preset: typeof permissionPreset
  ) => {
    const scopes = getScopesByPreset(preset);
    return scopes?.includes(scope) ?? false;
  };

  return (
    <div className="flex gap-2.5 rounded-md bg-gray-50 border py-1 px-2">
      <Shapes
        className={clsx(
          "size-4",

          isScopeEnabled("open_schedules", permissionPreset)
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Blend
        className={clsx(
          "size-4",

          isScopeEnabled("event_pool", permissionPreset)
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Blocks
        className={clsx(
          "size-4",

          isScopeEnabled("common_schedules", permissionPreset)
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Wrench
        className={clsx(
          "size-4",

          isScopeEnabled("group_settings", permissionPreset)
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
    </div>
  );
};
