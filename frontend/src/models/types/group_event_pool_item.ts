import { DocumentReference } from "firebase/firestore";
import { EventPoolItem } from "./event_pool_item";
import { DBAccount, DBGroupMember } from "~/lib/firestore/schemas";
import { DBGroupSchedule } from "~/lib/firestore/utils";

/**
 * ## AccountEventPoolItem
 * イベント候補のうち、特に個人が関わるイベントを表す
 *
 * #### 継承元のモデル
 * - [EventPoolItem](./event_pool_item.ts)
 *
 * #### これを継承するモデル
 * なし
 *
 * #### これを継承するDBスキーマ
 * - [DBGroupEventPoolItem](../../lib/firestore/schemas/group/event_pool.ts)
 */

export type GroupEventPoolItem = EventPoolItem & {
  created_by_account: DocumentReference<DBAccount>;
  created_by_member: DocumentReference<DBGroupMember>;
  scheduled_event_instances: DocumentReference<DBGroupSchedule>[];
};
