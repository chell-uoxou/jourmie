import { DocumentReference } from "firebase/firestore";
import { Member } from "./member";
import { ScheduledEvent } from "./scheduled_event";
import { Account } from "./account";

/**
 * ## GroupOpenSchedule
 * グループ内のメンバーが誰でも編集できる、全員の予定に関わらず好きなメンバーと自由に共同編集できる予定を表す型
 *
 * #### 継承元のモデル
 * - [Schedule](./schedule.ts)
 *
 * #### これを継承するモデル
 *   なし
 *
 * #### これを継承するDBスキーマ
 * - [DBGroupOpenSchedule](../../lib/firestore/schemas/group/open_schedules.ts)
 */
export type GroupOpenSchedule = ScheduledEvent & {
  members: DocumentReference<Member>[];
  created_by_member: DocumentReference<Member>;
  created_by_account: DocumentReference<Account>;
};
