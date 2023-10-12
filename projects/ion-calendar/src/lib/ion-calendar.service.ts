import { Inject, Injectable, Optional } from '@angular/core';
import { ICalendarDay, ICalendarLocale, ICalendarModalOptions, ICalendarMonth, ICalendarOriginal, ICalendarResult, IDayConfig } from './models';
import defaultValues, { displayModes, pickModes } from './types';
import { DateTimeHelper } from './helpers';
import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';

import { DateTime } from 'luxon';

const isBoolean = (input: any) => input === true || input === false;

@Injectable({
  providedIn: 'root'
})
export class IonCalendarService {

  private readonly defaultOpts: ICalendarModalOptions;

  constructor(@Optional() @Inject(DEFAULT_CALENDAR_OPTIONS) defaultOpts: ICalendarModalOptions) {
    this.defaultOpts = defaultOpts;
  }

  get DEFAULT_STEP() {
    return 12;
  }

  safeOpt(calendarOptions: any = {}): ICalendarModalOptions {
    const _disableWeeks: number[] = [];
    const _daysConfig: IDayConfig[] = [];

    const _locale: ICalendarLocale = calendarOptions.locale || defaultValues.LOCALE;

    const {
      locale = _locale,
      from = new Date(),
      to = undefined,
      weekStart = 0,
      step = this.DEFAULT_STEP,
      id = '',
      cssClass = '',
      closeLabel = 'CANCEL',
      doneLabel = 'DONE',
      monthFormat = 'MMM yyyy',
      // yearFormat = 'yyyy',
      title = 'CALENDAR',
      defaultTitle = '',
      defaultSubtitle = '',
      autoDone = false,
      canBackwardsSelected = false,
      closeIcon = false,
      doneIcon = false,
      pickMode = pickModes.SINGLE,
      color = defaultValues.COLOR,
      weekdays = DateTimeHelper.weekDays(_locale),
      daysConfig = _daysConfig,
      disableWeeks = _disableWeeks,
      showAdjacentMonthDay = true,
      clearLabel = null,
      displayMode = displayModes.MONTH,
      weeks = 1,
      continuous = true //false
    } = { ...this.defaultOpts, ...calendarOptions };

    const fromDate = DateTimeHelper.isDate(from) ? from : new Date();
    const toDate = DateTimeHelper.isDate(to) ? to : undefined;

    return {
      id,
      locale,
      from: fromDate,
      to: toDate,
      pickMode,
      autoDone,
      color,
      cssClass,
      weekStart,
      closeLabel,
      closeIcon,
      doneLabel,
      doneIcon,
      canBackwardsSelected,
      disableWeeks,
      monthFormat,
      // yearFormat,
      title,
      weekdays,
      daysConfig,
      step,
      defaultTitle,
      defaultSubtitle,
      defaultScrollTo: calendarOptions.defaultScrollTo || fromDate,
      defaultDate: calendarOptions.defaultDate || null,
      defaultDates: calendarOptions.defaultDates || null,
      defaultDateRange: calendarOptions.defaultDateRange || null,
      showAdjacentMonthDay,
      clearLabel,
      displayMode,
      weeks,
      continuous
    };
  }

  createOriginalCalendar(time: number, timeWithDay = false): ICalendarOriginal {
    const luxon = DateTimeHelper.parse(time);
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeek = new Date(year, month, 1).getDay();
    // const howManyDays = moment(time).daysInMonth();

    const howManyDays = luxon.daysInMonth!;
    const lastDay = luxon.endOf("day").valueOf();

    return {
      date,
      year,
      month,
      firstWeekDay: firstWeek,
      howManyDays,
      time: new Date(year, month, (timeWithDay) ? date.getDate() : 1).getTime(),
      lastDay
    };
  }

  private findDayConfig(day: DateTime, opt: ICalendarModalOptions): IDayConfig | null {
    const { daysConfig } = opt;

    const dayConfig = daysConfig?.find((config) => {
      const dateTime = DateTimeHelper.parse(config.date)
      return day.hasSame(dateTime, 'day');
    }) || null;

    return dayConfig;
  }

  /**
   * Create a calendar day object based on the given time, options, and month.
   *
   * @param {number} time - The time in milliseconds.
   * @param {ICalendarModalOptions} opt - The calendar modal options.
   * @param {number} month - The month number.
   * @return {ICalendarDay} The created calendar day object.
   */
  createCalendarDay(time: number, opt: ICalendarModalOptions, month?: number): ICalendarDay {
    const date = DateTimeHelper.parse(time).startOf("day");
    const isToday = DateTimeHelper.now().hasSame(date, 'day')
    const dayConfig = this.findDayConfig(date, opt);

    let disable = false;

    // Check if there is a specific disable configuration for the day
    if (dayConfig && isBoolean(dayConfig.disable)) {
      disable = dayConfig.disable!;
    }
    else {
      // If no specific disable configuration, check if the day is in the list of disabled weekdays
      disable = opt.disableWeeks?.indexOf(DateTimeHelper.weekday(date)) !== -1;

      if (!disable) {
        const dateFrom = opt.from === undefined ? undefined : DateTimeHelper.parse(opt.from).startOf("day");
        const dateTo = opt.to === undefined ? undefined : DateTimeHelper.parse(opt.to).startOf("day");

        // Check if the date is between the specified range
        if (!(dateFrom === undefined && dateTo === undefined)) {

          let isBetween = true;
          if (!opt.canBackwardsSelected) {
            if (dateFrom !== undefined && dateTo !== undefined) {
              // isBetween = Interval.fromDateTimes(dateFrom, dateTo).contains(date);
              isBetween = date >= dateFrom && date <= dateTo;  //hack
            }
            else if (dateFrom !== undefined && dateTo === undefined) {
              isBetween = date >= dateFrom;
            }
            else if (dateFrom === undefined && dateTo !== undefined) {
              isBetween = date <= dateTo;
            }
          }

          // Set the disable flag based on whether the date is between the range
          disable = !isBetween;
        }
      }
    }

    // Determine the title and subtitle for the calendar day
    const title = dayConfig?.title || opt.defaultTitle || new Date(time).getDate().toString();
    const subTitle = dayConfig?.subTitle || opt.defaultSubtitle || '';

    return {
      time,
      isToday,
      title,
      subTitle,
      selected: false,
      isLastMonth: month ? date.month < month : false,
      isNextMonth: month ? date.month > month : false,
      marked: dayConfig?.marked ?? false,
      cssClass: dayConfig?.cssClass ?? '',
      disable,
      isFirst: date.day === 1, //date.date() === 1,
      isLast: date.day === date.daysInMonth//date.date() === date.daysInMonth(),
    };
  }

  private createCalendarMonthOfWeek(original: ICalendarOriginal, opt: ICalendarModalOptions): ICalendarMonth {
    const weeks = opt.weeks ?? 1;
    const days: Array<ICalendarDay> = new Array(6).fill(null);

    let originalDate = original.date;
    let startWeek: number;
    let startDay: number;
    let startIndex = 0;

    // opt.continuous = true //@obsolete
    // if (opt.continuous) {
      if (originalDate.getDay() === 0) {
        startWeek = (opt.weekStart === 0) ? 0 : 1;
        startDay = originalDate.getDate() - (opt.weekStart === 0 ? 0 : 6);
      } else {
        startWeek = (opt.weekStart === 0) ? 0 : 1;
        startDay = originalDate.getDate() - (opt.weekStart === 0 ? originalDate.getDay() : originalDate.getDay() - 1);
      }
    // } else {
    //   if (originalDate.getDay() === 0) {

    //     startWeek = opt.weekStart === 0 ? 0 : (originalDate.getDate() - 6 > 1) ? 1 : original.firstWeekDay;
    //     startWeek = original.firstWeekDay < 0 ? 6 : original.firstWeekDay - 1;

    //     if (opt.weekStart === 0) {
    //       startWeek = 0;
    //       startDay = originalDate.getDate();
    //     } else {
    //       if (originalDate.getDate() - 6 > 1) {
    //         startWeek = 1;
    //         startDay = originalDate.getDate() - 6;
    //       } else {
    //         startWeek = original.firstWeekDay;
    //         startDay = 1;
    //         startIndex = startWeek - 1;
    //         if (startIndex < 0) {
    //           startIndex = 6;
    //         }
    //       }
    //     }
    //     if (opt.weekStart === 0) {
    //       startWeek = original.firstWeekDay < 0 ? 6 : original.firstWeekDay - 1;
    //       startDay = original.firstWeekDay < 0 ? 1 : originalDate.getDate() - 6;
    //       startIndex = original.firstWeekDay < 0 ? 6 : original.firstWeekDay - 1;
    //     } else {
    //       startWeek = 1;
    //       startDay = originalDate.getDate() - 6;
    //     }
    //   } else {
    //     if (opt.weekStart === 0) {
    //       if (originalDate.getDate() - originalDate.getDay() > 1) {
    //         startWeek = 0;
    //         startDay = originalDate.getDate() - originalDate.getDay();
    //       } else {
    //         startWeek = original.firstWeekDay;
    //         startDay = 1;
    //         startIndex = startWeek;
    //       }
    //     } else {
    //       if (originalDate.getDate() - (originalDate.getDay() - 1) > 1) {
    //         startWeek = 1;
    //         startDay = originalDate.getDate() - (originalDate.getDay() - 1);
    //       } else {
    //         startWeek = original.firstWeekDay;
    //         startDay = 1;
    //         startIndex = startWeek - 1;
    //       }
    //     }
    //   }
    // }

    for (let i = startIndex; i < 7 * weeks && (opt.continuous || startDay + (i - startIndex) <= original.howManyDays); i++) {
      let itemTime = new Date(original.year, original.month, startDay + (i - startIndex)).getTime();
      days[i] = this.createCalendarDay(itemTime, opt);
    }

    while (!opt.continuous && days.length <= 7 * (weeks - 1) && startDay != 1) {
      days.unshift(...new Array(7).fill(null));
      let i = 6;
      while (i >= 0 && startDay != 1) {
        startDay--;
        let itemTime = new Date(original.year, original.month, startDay).getTime();
        days[i] = this.createCalendarDay(itemTime, opt);
        i--;
      }
      original.date.setDate(startDay);
      original.time = new Date(original.date).getTime();
    }

    if (opt.showAdjacentMonthDay) {
      const _booleanMap = days.map(e => !!e);
      // const thisMonth = moment(original.time).month();
      const thisMonth = DateTimeHelper.parse(original.time).month;
      let startOffsetIndex = _booleanMap.indexOf(true) - 1;
      let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
      for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
        // const dayBefore = moment(days[startOffsetIndex + 1].time).clone().subtract(1, 'd');
        const dayBefore = DateTimeHelper.parse(days[startOffsetIndex + 1].time).minus({ days: 1 });
        days[startOffsetIndex] = this.createCalendarDay(dayBefore.valueOf(), opt, thisMonth);
      }

      if (!(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])) {
        for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
          // const dayAfter = moment(days[endOffsetIndex - 1].time).clone().add(1, 'd');
          const dayAfter = DateTimeHelper.parse(days[endOffsetIndex - 1].time).plus({ days: 1 });
          days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);
        }
      }
    }

    return {
      days,
      original: original,
    };
  }

  createCalendarMonth(original: ICalendarOriginal, opt: ICalendarModalOptions): ICalendarMonth {
    const days: Array<ICalendarDay> = new Array(6).fill(null);
    const len = original.howManyDays;

    for (let i = original.firstWeekDay; i < len + original.firstWeekDay; i++) {
      const itemTime = new Date(original.year, original.month, i - original.firstWeekDay + 1).getTime();
      days[i] = this.createCalendarDay(itemTime, opt);
    }

    if (opt.weekStart === 1) {
      if (days[0] === null) {
        days.shift();
      } else {
        days.unshift(...new Array(6).fill(null));
      }
    }

    if (opt.showAdjacentMonthDay && !Number.isNaN(original.time)) {
      // const thisMonth = moment(original.time).month();
      const thisMonth = DateTimeHelper.parse(original.time).month;
      const _booleanMap = days.map(e => !!e);

      let startOffsetIndex = _booleanMap.indexOf(true) - 1;
      // for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
      while (startOffsetIndex >= 0) {
        // const dayBefore = moment(days[startOffsetIndex + 1].time).clone().subtract(1, 'd');
        const dayBefore = DateTimeHelper.parse(days[startOffsetIndex + 1].time).minus({ days: 1 });
        days[startOffsetIndex] = this.createCalendarDay(dayBefore.valueOf(), opt, thisMonth);
        //_booleanMap[startOffsetIndex] = true;
        startOffsetIndex--;
      }

      if (!(_booleanMap.length % 7 === 0 && _booleanMap[_booleanMap.length - 1])) {
        let endOffsetIndex = _booleanMap.lastIndexOf(true) + 1;
        // for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
        while (endOffsetIndex < days.length + (endOffsetIndex % 7)) {
          // const dayAfter = moment(days[endOffsetIndex - 1].time).clone().add(1, 'd');
          // const timeAfter = endOffsetIndex = 0 ? original.time : days[endOffsetIndex - 1].time;
          const timeAfter = days[endOffsetIndex - 1].time;
          const dayAfter = DateTimeHelper.parse(timeAfter).plus({ days: 1 });
          days[endOffsetIndex] = this.createCalendarDay(dayAfter.valueOf(), opt, thisMonth);

          endOffsetIndex++;
        }
      }
    }

    return { days, original };
  }

  /**
   * Creates an array of CalendarMonth objects by period.
   *
   * @param {number} startTime - The start time of the period.
   * @param {ICalendarModalOptions} opt - The calendar modal options.
   * @return {Array<ICalendarMonth>} The array of CalendarMonth objects.
   */
  createWeeksByPeriod(startTime: number, opt: ICalendarModalOptions): Array<ICalendarMonth> {
    let result: Array<ICalendarMonth> = [];

    const time = DateTimeHelper.parse(startTime).valueOf();
    const originalCalendar = this.createOriginalCalendar(time, true);

    result.push(this.createCalendarMonthOfWeek(originalCalendar, opt));

    return result;
  }


  /**
   * Creates an array of CalendarMonth objects based on the given start time and the number of months.
   *
   * @param {number} startTime - The starting time in milliseconds.
   * @param {number} monthsNum - The number of months to create.
   * @param {ICalendarModalOptions} opt - The options for creating the CalendarMonth objects.
   * @return {Array<ICalendarMonth>} - An array of CalendarMonth objects.
   */
  createMonthsByPeriod(startTime: number, monthsNum: number, opt: ICalendarModalOptions): Array<ICalendarMonth> {
    const result = Array.from({ length: monthsNum }, (_, i) => {
      const time = DateTimeHelper.parse(startTime).startOf('month').plus({ months: i }).valueOf();
      const originalCalendar = this.createOriginalCalendar(time);
      const calendar = this.createCalendarMonth(originalCalendar, opt);

      return calendar;
    });

    return result;
  }

  /**
   * Creates an array of CalendarMonth objects based on the specified start year, number of years, and options.
   *
   * @param {number} startYear - The starting year.
   * @param {number} yearsNum - The number of years.
   * @param {ICalendarModalOptions} opt - The options for the calendar modal.
   * @return {Array<ICalendarMonth>} An array of CalendarMonth objects.
   */
  createYearsByPeriod(startYear: number, yearsNum: number, opt: ICalendarModalOptions): Array<ICalendarMonth> {
    return Array.from({ length: yearsNum }, (_, i) => {
      const time = DateTimeHelper.parse({ year: startYear + i, month: 1, day: 1 }).toMillis();
      const originalCalendar = this.createOriginalCalendar(time);
      const calendar = this.createCalendarMonth(originalCalendar, opt);

      return calendar;
    });
  }

  wrapResult(original: ICalendarDay[], pickMode: string) {
    let result: ICalendarResult | ICalendarResult[] | { from: ICalendarResult, to: ICalendarResult } | ICalendarDay[];

    switch (pickMode) {
      case pickModes.SINGLE:
        result = this.multiFormat(original[0].time);
        break;
      case pickModes.RANGE:
        result = {
          from: this.multiFormat(original[0].time),
          to: this.multiFormat((original[1] || original[0]).time),
        };
        break;
      case pickModes.MULTI:
        result = original.map(e => this.multiFormat(e.time));
        break;
      default:
        result = original;
    }
    return result;
  }

  multiFormat(time: number): ICalendarResult {
    // const _moment = moment(time);
    // return {
    //   time: _moment.valueOf(),
    //   unix: _moment.unix(),
    //   dateObj: _moment.toDate(),
    //   string: _moment.format(defaults.DATE_FORMAT),
    //   years: _moment.year(),
    //   months: _moment.month() + 1,
    //   date: _moment.date(),
    // };

    const luxonDate = DateTimeHelper.parse(time);
    return {
      time: luxonDate.toMillis(),
      seconds: luxonDate.toSeconds(),
      dateObj: luxonDate.toJSDate(),
      string: luxonDate.toFormat(defaultValues.DATE_FORMAT.replace(/Y/g, 'y')),
      year: luxonDate.year,
      month: luxonDate.month, // Note que o mês começa em 0 no Moment
      day: luxonDate.day,
    };
  }

}

