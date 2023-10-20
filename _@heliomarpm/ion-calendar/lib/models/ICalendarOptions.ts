import { DateType, PickModeType, DisplayModeType, ColorType } from "../types";
import { IDayConfig } from "./IDayConfig";

export interface ICalendarLocale {
  locale: string,
  weekdays: 'initial' | 'short',
  // startWeek?: 'sunday' | 'monday',
}
export interface ICalendarOptions {
  locale?: ICalendarLocale;
  from?: Date | number;
  to?: Date | number;
  pickMode?: PickModeType;
  disableWeeks?: Array<number>;
  weekStart?: 0 | 1;
  weekdays?: Array<string>;
  monthFormat?: string;
  color?: ColorType;
  colorSubtitle?: ColorType;
  defaultTitle?: string;
  defaultSubtitle?: string;
  daysConfig?: Array<IDayConfig>;
  displayMode?: DisplayModeType;
  showAdjacentMonthDay?: boolean;
  showMonthAdjacentDays?: boolean;
  weeks?: number;
}

export interface ICalendarModalOptions extends ICalendarOptions {
  autoDone?: boolean;
  format?: string;
  cssClass?: string;
  id?: string;
  closeLabel?: string;
  doneLabel?: string;
  clearLabel?: string;
  closeIcon?: boolean;
  doneIcon?: boolean;
  canBackwardsSelected?: boolean;
  title?: string;
  defaultScrollTo?: Date;
  defaultDate?: DateType;
  defaultDates?: DateType[];
  defaultDateRange?: { from: DateType; to?: DateType; } | null;
  step?: number;
}

export interface ICalendarComponentOptions extends ICalendarOptions {
  showToggleButtons?: boolean;
  showMonthPicker?: boolean;
  showYearPicker?: boolean;
  monthsTitle?: string[];
}

