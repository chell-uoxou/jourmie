<a name="accounts"></a>

# accounts コレクション
## フィールド
- `email` (string): メアド
- `default_display_name` (string): デフォルトの表示名
- `avatar_url` (string, URL): アバターURL
- `password_hash` (string): パスワード（salt付きでhash化）
- `last_name` (string): 姓
- `first_name` (string): 名
- `phone_number` (string): 電話番号
- `address` (string): 住所
- `groups` (Array of Reference): 所属している[グループ](#groups)への参照の配列(`groups/{group_id}`)

## サブコレクション
<a name="accounts/event_pool"></a>

### event_pool
- `title` (string): イベント候補タイトル
- `description` (string): イベント候補説明
- `location_text` (string): イベント候補場所（住所検索などで選択したらその文字に書き換わる）
- `location_coordinates` (GeoPoint): イベントの開催場所
- `attached_image` (string, URL): イベント候補添付画像
- `available_times` (array): 行ける時間（配列）
  **各要素のフィールド**
  - `start_time` (timestamp): 行ける時間開始日時
  - `end_time` (timestamp): 行ける時間終了日時
- `default_duration` (integer, minutes): デフォルト所要時間
- `default_budget` (object): デフォルト予算
  - `mode` (string): デフォルト予算モード（`per_person` / `total`）
  - `value` (integer): デフォルト予算値
- `needs_preparation` (boolean): 参加準備が必要か？
- `preparation_task` (string): 参加準備のタスク
- `max_participants` (integer): 最大人数
- `notes` (string): 備考欄
- `schedule_instances`: (Array of Reference): そのイベント候補を元に作成された[scheduleの実態](#accounts/schedules)への参照の配列

<a name="accounts/schedule_memos"></a>

### schedule_memos
- `title` (string): タイトル
- `description` (string): 説明
- `start_time` (timestamp): 開始日時
- `end_time` (timestamp): 終了日時
- `location_text` (string): 場所のテキスト
- `location_coordinates` (string): 場所の座標

<a name="accounts/schedules"></a>

### schedules
- `event_reference` (Reference): [予定イベント候補](#accounts/event_pool)への参照（`accounts/{account_id}/event_pool/{event_id}`）
- `start_time` (timestamp): 開始日時
- `end_time` (timestamp): 終了日時
- `actual_budget` (object): 実際の予算
  - `mode` (string): 実際の予算モード（`per_person` / `total`）
  - `value` (integer): 実際の予算値
- `did_prepare` (boolean): 参加準備をしたかどうか

---

<a name="groups"></a>

# groups コレクション
- `name` (string): グループ名
- `description` (string): グループ説明
- `icon_url` (string, URL): グループアイコンURL

## サブコレクション

<a name="groups/event_pool"></a>

### event_pool
[accounts/event_poolサブコレクション](#accounts/event_pool)と同じスキーマ

<a name="groups/schedule_memos"></a>

### schedule_memos
[accounts/schedule_memosサブコレクション](#accounts/schedule_memos)と同じスキーマ

<a name="groups/common_schedules"></a>

### common_schedules
- `event_reference` (Reference): グループの[イベント候補](#groups/schedule_memos)への参照（`groups/{groupId}/event_pool/{event_id}`）
- `start_time` (timestamp): 開始日時
- `end_time` (timestamp): 終了日時
- `participant_members` (array of References): 参加メンバーへの参照の配列（`groups/{groupId}/members/{memberId}`）
- `actual_budget` (object): 実際の予算
  - `mode` (string): 実際の予算モード（`per_person` / `total`）
  - `value` (integer): 実際の予算値
- `did_prepare` (boolean): 参加準備をしたかどうか

<a name="groups/open_schedules"></a>

### open_schedules
[groups/common_schedulesサブコレクション](#groups/common_schedules)と同じスキーマ

<a name="groups/members"></a>

### members
- `account_reference` (Reference): [所属グループ](#groups)への参照（`groups/{group_id}`）
- `display_name` (string): グループメンバー表示名
- `editing_permission_scopes` (array): グループメンバー権限（`common_schedules`、`open_schedules`、`event_pool`、`group_settings`）
- `notes` (string): グループメンバー備考
