"use client";

import * as React from "react";

import { Calendar } from "~/components/ui/calendar";

import { useCalendarSession } from "~/hooks/useCalendarSession";

export function CalendarTile() {
  const { calendarSession, updateCalendarSession } = useCalendarSession();

  return (
    <Calendar
      mode="single"
      selected={calendarSession.currentDate}
      onSelect={(date) => {
        if (date) {
          updateCalendarSession("currentDate", date);
        }
      }}
      className="rounded-md border"
    />
  );
}
