import {
  DBAccountEventPoolItem,
  DBAccountSchedule,
  DBGroupCommonSchedule,
  DBGroupEventPoolItem,
  DBGroupOpenSchedule,
} from "./schemas";

export type DBSchedule =
  | DBAccountSchedule
  | DBGroupCommonSchedule
  | DBGroupOpenSchedule;

export type DBGroupSchedule = DBGroupCommonSchedule | DBGroupOpenSchedule;

export type DBEventPoolItem = DBAccountEventPoolItem | DBGroupEventPoolItem;

export const isValidAsAccountSchedule = (
  schedule: DBSchedule
): schedule is DBAccountSchedule => {
  return !("members" in schedule);
};

export const isValidAsGroupCommonSchedule = (
  schedule: DBSchedule
): schedule is DBGroupCommonSchedule => {
  return "members" in schedule;
};

export const isValidAsGroupOpenSchedule = (
  schedule: DBSchedule
): schedule is DBGroupOpenSchedule => {
  return "members" in schedule;
};

export const isReady = <T>(
  hookResult: T | null | "loading"
): hookResult is T => {
  return hookResult !== "loading" && hookResult !== null;
};
