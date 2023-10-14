import { DateObjectUnits, DateTime } from 'luxon';
import { ICalendarLocale } from '../models';

export type DateType = Date | string | number | null;
export type CalendarComponentType = 'string' | 'js-date' | 'luxon' | 'time' | 'object';
export type CalendarComponentPayloadType = string | number | Date | DateTime | DateObjectUnits ;
export type CalendarComponentPayloadRangeType = { from: CalendarComponentPayloadType, to: CalendarComponentPayloadType };
export type CalendarComponentOnChangeType = CalendarComponentPayloadType | CalendarComponentPayloadType[] | CalendarComponentPayloadRangeType

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
};

export default defaultValues;
