import { atom } from "jotai";

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
console.log("currentDate", currentDate);

export type CalendarSession = {
  currentDate: Date;
};

export const calendarSessionAtom = atom<CalendarSession>({
  currentDate: currentDate,
});
