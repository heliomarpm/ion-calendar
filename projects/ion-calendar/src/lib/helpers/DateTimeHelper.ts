import { DateTime, Info } from "luxon";
import { CalendarComponentPayloadType } from "../types";
import { ICalendarLocale } from "../models";

class DateTimeHelper {
  static parse(date: CalendarComponentPayloadType | undefined): DateTime {
    if (!date) return DateTime.now();

    if (typeof date === 'number') {
      return DateTime.fromMillis(date);
    }
    else if (typeof date === 'string') {
      return DateTime.fromISO(date);
    }
    else if (date instanceof Date) {
      return DateTime.fromJSDate(date);
    }

    return DateTime.fromObject(date);
  }

  static now() {
    return DateTime.now();
  }

  static isDate(value: any): boolean {
    if (value instanceof Date) {
      // Verifique se o objeto Date não é 'Invalid Date'
      return value.toString() !== 'Invalid Date';
    }

    if (typeof value === 'number') {
      return this.parse(value).isValid
    }

    if (typeof value === 'string') {
      return this.parse(value).isValid;
    }

    // Se não for uma data válida em nenhum formato conhecido, retorne false
    return false;
  }

  /**
  * Calculates the first and last day of the week for a given date.
  *
  * @param {Date} date - The date for which to calculate the first and last day of the week.
  * @return {{firstDay: Date, lastDay: Date}} - An object containing the first and last day of the week.
  *
  * @example
  * const today = new Date();
  * const weekRange = getFirstAndLastDayOfWeek(today);
  * console.log(weekRange.firstDay.toDateString()); // Output: Sun Oct 08 2023
  * console.log(weekRange.lastDay.toDateString()); // Output: Sat Oct 14 2023
  */
  static getFirstAndLastDayOfWeek(date: Date): { firstDay: Date, lastDay: Date } {
    const currentDay = date.getDay(); // Dia da semana (0 - Domingo, 1 - Segunda, ..., 6 - Sábado)
    const diff = currentDay - 0; // 0 representa o Domingo

    // Primeiro dia da semana (Domingo)
    const firstDay = new Date(date);
    firstDay.setDate(date.getDate() - diff);

    // Último dia da semana (Sábado)
    const lastDay = new Date(date);
    lastDay.setDate(date.getDate() + (6 - diff));

    return { firstDay, lastDay };
  }

  static monthsShortTitle(locale: string = 'en') {
    return Info.months('short', { locale }).map(m => m.substring(0, 3).toUpperCase());
  }

  static weekDays(locale: ICalendarLocale = { locale: 'en', weekdays: 'initial' }) {
    const { locale: l, weekdays: w } = locale;
    let weeksDay = Info.weekdays('short', { locale: l }).map(d => w === 'initial' ? d.substring(0, 1).toUpperCase() : d.toUpperCase());

    const today = DateTime.now();
    const firstDay = this.getFirstAndLastDayOfWeek(today.toJSDate()).firstDay.getDay();

    if (firstDay < Number(today.startOf('week').toFormat('dd'))) {
      weeksDay.unshift(weeksDay.pop()!);
    }
    return weeksDay;
  }

  static weekday(date: DateTime) {
    const wd = date.weekday;
    return wd < 7 ? wd : 0;
  }
}

export default DateTimeHelper;
