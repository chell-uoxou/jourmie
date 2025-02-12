import { ScheduledEvent } from "./scheduled_event";

/**
 * ## AccountSchedule
 * 個人の予定を表す型。
 *
 * #### 継承元のモデル
 * - [Schedule](./schedule.ts)
 *
 * #### これを継承するモデル
 * なし
 *
 * #### これを継承するDBスキーマ
 * - [DBAccountSchedule](../../lib/firestore/schemas/account/schedules.ts)
 */
export type AccountSchedule = ScheduledEvent;
