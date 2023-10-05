import { ICalendarOriginal } from './ICalendarOriginal';
import { ICalendarDay } from './ICalendarDay';


export interface ICalendarMonth {
  original: ICalendarOriginal;
  days: Array<ICalendarDay>; // | void>;
}
