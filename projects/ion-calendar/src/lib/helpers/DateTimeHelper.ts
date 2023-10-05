import { DateTime } from "luxon";
import { CalendarComponentPayloadType } from "../types";

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
}

export default DateTimeHelper;
