import { DocumentReference, Timestamp } from "firebase/firestore";
import { BudgetMode } from "./common";
import { DBEventPoolItem } from "~/lib/firestore/utils";

/**
 * ## ScheduledEvent
 * プロダクト内の予定にまつわる情報の共通の型。
 *
 * #### これを継承するモデル
 * - [AccountSchedule](./account_schedule.ts)
 * - [GroupOpenSchedule](./group_open_schedule.ts)
 * - [GroupCommonSchedule](./group_common_schedule.ts)
 *
 * #### これを継承するDBスキーマ
 *   なし
 */
export type ScheduledEvent = {
  event_reference: DocumentReference<DBEventPoolItem>;
  start_time: Timestamp;
  end_time: Timestamp;
  actual_budget: {
    mode: BudgetMode;
    value: number;
  };
  did_prepare: boolean;
};
