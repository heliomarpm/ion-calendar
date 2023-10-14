import { Inject, Injectable, Optional } from '@angular/core';
import { ICalendarDay, ICalendarLocale, ICalendarModalOptions, ICalendarMonth, ICalendarOriginal, ICalendarResult, IDayConfig } from './models';
import defaultValues, { PickModeType, displayModes, pickModes } from './types';
import { DateTimeHelper } from './helpers';
import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';

import { DateTime } from 'luxon';

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
      title = 'CALENDAR',
      defaultTitle = '',
      defaultSubtitle = '',
      autoDone = false,
      canBackwardsSelected = false,
      closeIcon = false,
      doneIcon = false,
      pickMode = defaultValues.PICK_MODE,
      color = defaultValues.COLOR,
      colorSubtitle = undefined,
      weekdays = DateTimeHelper.weekDays(_locale),
      daysConfig = _daysConfig,
      disableWeeks = _disableWeeks,
      clearLabel = null,
      displayMode = defaultValues.DISPLAY_MODE,
      showAdjacentMonthDay = true,
      showMonthAdjacentDays = false,
      weeks = 1
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
      colorSubtitle,
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
      clearLabel,
      showAdjacentMonthDay,
      showMonthAdjacentDays,
      displayMode,
      weeks
    };
  }

  createOriginalCalendar(time: number, timeWithDay = false): ICalendarOriginal {
    const luxon = DateTimeHelper.parse(time);
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstWeek = new Date(year, month, 1).getDay();
    // const howManyDays = moment(time).daysInMonth();

    const daysInMonth: number = luxon.daysInMonth!;
    const lastDayOfMonth = luxon.endOf("month").valueOf();

    return {
      date,
      year,
      month,
      firstWeekDay: firstWeek,
      daysInMonth,
      time: new Date(year, month, (timeWithDay) ? date.getDate() : 1).getTime(),
      lastDayOfMonth
    };
  }

  private findDayConfig(day: DateTime, options: ICalendarModalOptions): IDayConfig | null {
    const { daysConfig } = options;

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
   * @param {ICalendarModalOptions} options - The calendar modal options.
   * @param {number} month - The month number.
   * @return {ICalendarDay} The created calendar day object.
   */
  createCalendarDay(time: number, options: ICalendarModalOptions, month?: number): ICalendarDay {
    const date = DateTimeHelper.parse(time).startOf("day");
    const isToday = DateTimeHelper.now().hasSame(date, 'day')
    const dayConfig = this.findDayConfig(date, options);

    let disable = false;

    // Check if there is a specific disable configuration for the day
    if (dayConfig && dayConfig.disable !== undefined) {
      disable = dayConfig.disable!;
    }
    else {
      // If no specific disable configuration, check if the day is in the list of disabled weekdays
      const dayOfWeek = DateTimeHelper.weekday(date);
      disable = options.disableWeeks?.includes(dayOfWeek) || false;

      if (!disable) {
        const dateFrom = options.from === undefined ? undefined : DateTimeHelper.parse(options.from).startOf("day");
        const dateTo = options.to === undefined ? undefined : DateTimeHelper.parse(options.to).startOf("day");

        if (!options.canBackwardsSelected) {
          // Check if the date is between the specified range
          if (dateFrom !== undefined && dateTo !== undefined) {
            disable = !(date >= dateFrom && date <= dateTo);
          } else if (dateFrom !== undefined) {
            disable = date < dateFrom;
          } else if (dateTo !== undefined) {
            disable = date > dateTo;
          }
        }
      }
    }

    // Determine the title and subtitle for the calendar day
    const title = dayConfig?.title || options.defaultTitle || new Date(time).getDate().toString();
    const subTitle = dayConfig?.subTitle || options.defaultSubtitle || '';

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

  /**
   * Creates a calendar month of a given week.
   *
   * @param {ICalendarOriginal} original - The original calendar data.
   * @param {ICalendarModalOptions} options - The calendar modal options.
   * @returns {ICalendarMonth} The calendar month of the given week.
   */
  private createCalendarMonthOfWeek(original: ICalendarOriginal, options: ICalendarModalOptions): ICalendarMonth {
    const { weeks = 1, weekStart, showAdjacentMonthDay, showMonthAdjacentDays, displayMode } = options;
    const { date, year, month } = original;
    const days: ICalendarDay[] = new Array(6).fill(null);

    const calculateStartDay = (originalDate: Date): number => {
      const dayOfWeek = originalDate.getDay();
      return originalDate.getDate() - (weekStart === 0 ? dayOfWeek : dayOfWeek - 1);
    };


    const createDay = (currentTime: number): ICalendarDay => {
      const month = DateTimeHelper.parse(original.time).month;
      const dateTime = DateTimeHelper.parse(currentTime);
      const isDifferentMonth = dateTime.month !== month;

      // Show months in weekdays adjecent of selected month
      if (displayMode === displayModes.week && showMonthAdjacentDays && isDifferentMonth) {
        const optClone: ICalendarModalOptions = JSON.parse(JSON.stringify(options));
        const dayConfig: IDayConfig | null = this.findDayConfig(dateTime, optClone);

        if (dayConfig === null) {
          if (!optClone.daysConfig) optClone.daysConfig = [];
          optClone.daysConfig.push({ date: dateTime.toJSDate(), subTitle: dateTime.monthShort! });
        }

        return this.createCalendarDay(currentTime, optClone, month);
      }

      return this.createCalendarDay(currentTime, options, month);
    };


    const startDay = calculateStartDay(date);
    let startIndex = 0;

    for (let i = startIndex; i < 7 * weeks; i++) {
      const itemTime = new Date(year, month, startDay + (i - startIndex)).getTime();
      days[i] = createDay(itemTime);
    }

    if (displayMode === displayModes.month && showAdjacentMonthDay) {
      const dayExists = days.map(day => !!day);

      let startOffsetIndex = dayExists.indexOf(true) - 1;
      let endOffsetIndex = dayExists.lastIndexOf(true) + 1;

      for (startOffsetIndex; startOffsetIndex >= 0; startOffsetIndex--) {
        const dayBefore = DateTimeHelper.parse(days[startOffsetIndex + 1].time).minus({ days: 1 });
        days[startOffsetIndex] = createDay(dayBefore.valueOf());
      }

      if (!(dayExists.length % 7 === 0 && dayExists[dayExists.length - 1])) {
        for (endOffsetIndex; endOffsetIndex < days.length + (endOffsetIndex % 7); endOffsetIndex++) {
          const dayAfter = DateTimeHelper.parse(days[endOffsetIndex - 1].time).plus({ days: 1 });
          days[endOffsetIndex] = createDay(dayAfter.valueOf());
        }
      }
    }

    return { days, original };
  }

  createCalendarMonth(original: ICalendarOriginal, opt: ICalendarModalOptions): ICalendarMonth {
    const days: Array<ICalendarDay> = new Array(6).fill(null);
    const daysInMonth = original.daysInMonth;

    for (let i = original.firstWeekDay; i < daysInMonth + original.firstWeekDay; i++) {
      const itemTime = new Date(original.year, original.month, i - original.firstWeekDay + 1).getTime();
      days[i] = this.createCalendarDay(itemTime, opt);
    }

    if (opt.weekStart == 1) {
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

  wrapResult(original: ICalendarDay[], pickMode: PickModeType) {
    let result: ICalendarResult | ICalendarResult[] | { from: ICalendarResult, to: ICalendarResult } | ICalendarDay[];

    switch (pickMode) {
      case pickModes.single:
        result = this.multiFormat(original[0].time);
        break;
      case pickModes.range:
        result = {
          from: this.multiFormat(original[0].time),
          to: this.multiFormat((original[1] || original[0]).time),
        };
        break;
      case pickModes.multi:
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

