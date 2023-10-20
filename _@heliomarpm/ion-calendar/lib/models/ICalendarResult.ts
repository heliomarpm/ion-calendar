export class ICalendarResult {
  time: number = 0;
  seconds: number = 0;
  dateObj: Date = new Date();
  string: string = '';
  year: number = 0;
  month: number = 0;
  day: number = 0;
}

export class ICalendarComponentWeekChange {
  oldWeek!: ICalendarResult;
  newWeek!: ICalendarResult;
}

export class ICalendarComponentMonthChange {
  oldMonth!: ICalendarResult;
  newMonth!: ICalendarResult;
}

