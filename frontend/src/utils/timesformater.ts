import { Timestamp } from "firebase/firestore";
import { TimeRange } from "~/models/types/common";

export default function formatTimes(times: TimeRange[]) {
  const { start_time, end_time } = times[0] ?? {
    start_time: Timestamp.now(),
    end_time: Timestamp.now(),
  };

  const startDate = start_time.toDate();
  const endDate = end_time.toDate();

  const sameDay = startDate.toDateString() === endDate.toDateString();

  const startFormatted = startDate.toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endFormatted = endDate.toLocaleString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    ...(sameDay ? {} : { year: "numeric", month: "numeric", day: "numeric" }),
  });

  return sameDay
    ? `${startFormatted} ~ ${endFormatted}`
    : `${startFormatted} ~ ${endFormatted}`;
}
