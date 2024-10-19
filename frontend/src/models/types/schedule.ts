import { DocumentReference, Timestamp } from "firebase/firestore";
import { EventPoolItem } from "./event_pool_item";
import { BudgetMode } from "./common";


/**
 * ## Schedule
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
export type Schedule = {
  event_reference: DocumentReference<EventPoolItem>;
  start_time: Timestamp;
  end_time: Timestamp;
  actual_budget: {
    mode: BudgetMode;
    value: number;
  };
  did_prepare: boolean;
};
