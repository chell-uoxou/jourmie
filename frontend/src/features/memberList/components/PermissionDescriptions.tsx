import clsx from "clsx";
import { Shapes, Blend, Blocks, Wrench } from "lucide-react";
import { ReactNode } from "react";
import {
  GroupMemberPermissionPreset,
  isScopeEnabled,
} from "~/models/types/permission";

export const PermissionDescriptions = ({
  presetName,
}: {
  presetName: GroupMemberPermissionPreset;
}) => {
  return (
    <div className="flex flex-col gap-2 pb-3 pt-1 px-1">
      <PermDescItem
        icon={<Shapes className="size-4" />}
        isActive={isScopeEnabled("open_schedules", presetName)}
      >
        {isScopeEnabled("open_schedules", presetName)
          ? "みんなの予定の編集ができます"
          : "みんなの予定の編集ができません"}
      </PermDescItem>
      <PermDescItem
        icon={<Blend className="size-4" />}
        isActive={isScopeEnabled("common_schedules", presetName)}
      >
        {isScopeEnabled("common_schedules", presetName)
          ? "グループ共通の予定の編集ができます"
          : "グループ共通の予定の編集ができません"}
      </PermDescItem>
      <PermDescItem
        icon={<Blocks className="size-4" />}
        isActive={isScopeEnabled("event_pool", presetName)}
      >
        {isScopeEnabled("event_pool", presetName)
          ? "イベント候補の追加・編集・削除ができます"
          : "イベント候補の追加・編集・削除ができません"}
      </PermDescItem>
      <PermDescItem
        icon={<Wrench className="size-4" />}
        isActive={isScopeEnabled("group_settings", presetName)}
      >
        {isScopeEnabled("group_settings", presetName)
          ? "メンバーの管理やグループ設定の変更ができます"
          : "メンバーの管理やグループ設定の変更ができません"}
      </PermDescItem>
    </div>
  );
};

const PermDescItem = ({
  icon,
  children,
  isActive,
}: {
  icon: ReactNode;
  children: ReactNode;
  isActive: boolean;
}) => {
  return (
    <div className={clsx("flex gap-3 items-center")}>
      <div
        className={clsx(
          isActive ? "text-green-500" : "opacity-30 stroke-gray-900"
        )}
      >
        {icon}
      </div>
      <p className="text-sm">{children}</p>
    </div>
  );
};
