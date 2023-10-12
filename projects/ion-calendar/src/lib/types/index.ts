import { Info as luxonInfo } from 'luxon';
import { ICalendarLocale } from '../models';
import { DateTimeHelper } from '../helpers';

export type DateType = Date | string | number | null;
export type CalendarComponentPayloadType = string | number | Date | {};
export type CalendarComponentType = 'string' | 'js-date' | 'luxon' | 'time' | 'object';

export enum Colors {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  DANGER = 'danger',
  LIGHT = 'light',
  DARK = 'dark'
}

export const pickModes = {
  SINGLE: 'single',
  RANGE: 'range',
  MULTI: 'multi'
};
// export type PickModeType = keyof typeof pickModes[][number];
export type PickModeType = typeof pickModes[keyof typeof pickModes]

export const displayModes = {
  MONTH: 'month',
  WEEK: 'week',
}
export type DisplayModeType = typeof displayModes[keyof typeof displayModes]

const defaultValues = {
  COLOR: 'primary',
  DATE_FORMAT: 'yyyy-MM-dd',
  LOCALE: { locale: 'en', weekdays: 'initial', startWeek: 'sunday' } as ICalendarLocale,
  YEAR_FORMAT: 'yyyy',
  // MONTHS_TITLE: (locale: string = 'en') => {
  //   return DateTimeHelper.monthsShortTitle(locale);
  // },
  // WEEKDAYS_TITLE: (locale: ICalendarLocale = { locale: 'en', weekdays: 'initial', startWeek: 'sunday' }) => {
  //   return DateTimeHelper.weekDays(locale);
  // },
  // MONTHS_TITLE: luxonInfo.months('short', {locale: 'en'}).map(m => m.substring(0, 3).toUpperCase()), //['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  // WEEKS_TITLE: luxonInfo.weekdays('short', {locale: 'en'}).map(d => d.substring(0, 1).toUpperCase()),
  // WEEKS_TITLE: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

export default defaultValues;
