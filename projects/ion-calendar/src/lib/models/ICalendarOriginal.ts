export interface ICalendarOriginal {
  time: number;
  date: Date;               //Date(time)
  year: number;             //date.getFullYear()
  month: number;            //date.getMonth()
  firstWeekDay: number;     //Date(year, month, 1).getDay()
  daysInMonth: number;      //luxon(time).daysInMonth
  lastDayOfMonth: number;   //luxon(time).endOf('month').valueOf()
}
