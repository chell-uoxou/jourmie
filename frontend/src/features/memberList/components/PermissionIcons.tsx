import clsx from "clsx";
import { Blend, Blocks, Shapes, Wrench } from "lucide-react";
import { GroupMemberPermissionScope } from "~/models/types/permission";

interface PermissionIconsProps {
  permissionScopes: GroupMemberPermissionScope[];
  showContainer?: boolean;
}

export const PermissionIcons = ({
  permissionScopes,
  showContainer,
}: PermissionIconsProps) => {
  return (
    <div
      className={clsx(
        "flex gap-2.5",
        showContainer ? "rounded-md bg-gray-50 border py-1 px-2" : ""
      )}
    >
      <Shapes
        className={clsx(
          "size-4",

          permissionScopes.includes("open_schedules")
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Blend
        className={clsx(
          "size-4",

          permissionScopes.includes("common_schedules")
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Blocks
        className={clsx(
          "size-4",

          permissionScopes.includes("event_pool")
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
      <Wrench
        className={clsx(
          "size-4",

          permissionScopes.includes("group_settings")
            ? "stroke-emerald-400"
            : "opacity-30 stroke-gray-900"
        )}
      />
    </div>
  );
};
