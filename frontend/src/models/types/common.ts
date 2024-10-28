import { Timestamp } from "firebase/firestore";

/**
 * ## BudgetMode
 * 予算の計算方法を表す文字列
 */
export type BudgetMode = "per_person" | "total";

/**
 * ## TimeRange
 * 時間の範囲を表すタプル
 */
export type TimeRange = {
  start_time: Timestamp;
  end_time: Timestamp;
};
