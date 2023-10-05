import { DateTime } from "luxon/src/datetime";

export interface ICalendarOriginal {
  time: number;
  date: Date;
  year: number;
  month: number;
  firstWeekDay: number;
  howManyDays: number;
  lastDay: number;
}
