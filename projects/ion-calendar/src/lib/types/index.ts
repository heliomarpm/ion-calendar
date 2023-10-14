import { ICalendarLocale } from '../models';

export type DateType = Date | string | number | null;
export type CalendarComponentPayloadType = string | number | Date | {};
export type CalendarComponentType = 'string' | 'js-date' | 'luxon' | 'time' | 'object';

// export enum Colors {
//   PRIMARY = 'primary',
//   SECONDARY = 'secondary',
//   DANGER = 'danger',
//   LIGHT = 'light',
//   DARK = 'dark'
// }

export type ColorType = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light' | 'custom' | 'transparent' | '';

export const pickModes = {
  single: 'single',
  range: 'range',
  multi: 'multi'
};
export type PickModeType = keyof typeof pickModes[][number];
// export type PickModeType = 'single' | 'range' | 'multi';

export const displayModes = {
  month: 'month',
  week: 'week',
}
export type DisplayModeType = keyof typeof displayModes[][number];
// export type DisplayModeType = typeof displayModes[keyof typeof displayModes]


const defaultValues = {
  COLOR: 'primary',
  PICK_MODE: pickModes.single,
  DISPLAY_MODE: displayModes.month,
  DATE_FORMAT: 'yyyy-MM-dd',
  LOCALE: { locale: 'en', weekdays: 'initial' } as ICalendarLocale,
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
