import { DBAccountSchedule } from "~/lib/firestore/schemas";
import { EventPoolItem } from "./event_pool_item";
import { DocumentReference } from "firebase/firestore";

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
 * - [DBAccountEventPoolItem](../../lib/firestore/schemas/account/event_pool.ts)
 */

export type AccountEventPoolItem = EventPoolItem & {
  scheduled_event_instances: DocumentReference<DBAccountSchedule>[];
};
