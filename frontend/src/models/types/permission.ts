/**
 * ## GroupMemberPermissionScope
 * 予定の編集権限の対象を表す文字列。配列に入れて使う。
 *
 * `open_schedules`: みんなの予定を編集できる（デフォルトで有効）
 * `event_pool`: イベント候補一覧を編集できる（デフォルトで有効）
 * `common_schedules`: 共通予定を編集できる
 * `group_settings`: グループ設定を編集できる
 */
export type GroupMemberPermissionScope =
  | "open_schedules"
  | "common_schedules"
  | "event_pool"
  | "group_settings";

export const groupMemberPermissionPreset: Record<
  string,
  GroupMemberPermissionScope[]
> = {
  "cannot-edit": [],
  "can-edit-open-schedule": ["open_schedules"],
  "can-edit-event-pool": ["open_schedules", "event_pool"],
  "can-edit-all-schedule": ["open_schedules", "event_pool", "common_schedules"],
  admin: ["open_schedules", "event_pool", "common_schedules", "group_settings"],
};

export type GroupMemberPermissionPreset =
  keyof typeof groupMemberPermissionPreset;
