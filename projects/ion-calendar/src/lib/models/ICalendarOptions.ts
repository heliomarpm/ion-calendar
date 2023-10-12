import { DateType, PickModeType, DisplayModeType } from "../types";
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
  weekStart?: number;
  weekdays?: Array<string>;
  monthFormat?: string;
  // yearFormat?: string;
  color?: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  daysConfig?: Array<IDayConfig>;
  /**
   * show last month & next month days fill six weeks
   */
  showAdjacentMonthDay?: boolean;
  displayMode?: DisplayModeType;
  weeks?: number;
  continuous?: boolean;
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

