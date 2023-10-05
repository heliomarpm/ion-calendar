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
  DATE_FORMAT: 'yyyy-MM-dd',
  COLOR: 'primary',
  WEEKS_FORMAT: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  MONTH_FORMAT: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  YEAR_FORMAT: 'yyyy'
};

export default defaultValues;


