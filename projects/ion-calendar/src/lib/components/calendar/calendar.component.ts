import { Component, Input, OnInit, Output, EventEmitter, forwardRef, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Settings as luxonSettings, DateTime } from 'luxon';
import { DateTimeHelper } from '../../helpers';

import { IonCalendarService } from '../../ion-calendar.service';
import { ICalendarComponentMonthChange, ICalendarComponentOptions, ICalendarComponentWeekChange, ICalendarDay, ICalendarModalOptions, ICalendarMonth } from '../../models';
import defaultValues, { CalendarComponentOnChangeType, CalendarComponentPayloadRangeType, CalendarComponentPayloadType, CalendarComponentType, ColorType, pickModes } from '../../types';

export const ION_CAL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CalendarComponent),
  multi: true,
};
@Component({
  selector: 'ion-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [ION_CAL_VALUE_ACCESSOR],
})
export class CalendarComponent implements ControlValueAccessor, OnInit {

  def!: ICalendarModalOptions;
  monthOpt!: ICalendarMonth;
  calendarMonthValue: Array<ICalendarDay | null> = [null, null];
  view: 'year' | 'month' | 'days' = 'days';
  yearStep: number = 0;

  public _monthsTitle = DateTimeHelper.monthsShortTitle();

  private _showToggleButtons = true;
  get showToggleButtons(): boolean {
    return this._showToggleButtons;
  }
  set showToggleButtons(value: boolean) {
    this._showToggleButtons = value;
  }

  private _showMonthPicker = true;
  get showMonthPicker(): boolean {
    return this._showMonthPicker;
  }
  set showMonthPicker(value: boolean) {
    this._showMonthPicker = value;
  }

  // private _showYearPicker = true;
  // private get showYearPicker(): boolean {
  //   return this._showYearPicker;
  // }
  // private set showYearPicker(value: boolean) {
  //   this._showYearPicker = value;
  // }

  private _options: ICalendarComponentOptions = {};
  get options(): ICalendarComponentOptions {
    return this._options;
  }

  @Input()
  set options(value: ICalendarComponentOptions) {
    this._options = value;
    this.initOpt();
    if (this.monthOpt && this.monthOpt.original) {
      //this.monthOpt = this.createMonth(this.monthOpt.original.time);
      this.createWeekOrMonth(this.monthOpt.original.time);
    }
  }

  // @Input()
  // set locale(locale: string) {
  //   luxonSettings.defaultLocale = locale;
  // }
  @Input() color: ColorType | undefined = undefined;
  @Input() format: string = defaultValues.DATE_FORMAT;
  @Input() type: CalendarComponentType = 'string';
  @Input() readonly = false;

  @Output() onChange: EventEmitter<CalendarComponentOnChangeType> = new EventEmitter();
  @Output() onMonthChange: EventEmitter<ICalendarComponentMonthChange> = new EventEmitter();
  @Output() onWeekChange: EventEmitter<ICalendarComponentWeekChange> = new EventEmitter();
  @Output() onSelect: EventEmitter<ICalendarDay> = new EventEmitter();
  @Output() onSelectStart: EventEmitter<ICalendarDay> = new EventEmitter();
  @Output() onSelectEnd: EventEmitter<ICalendarDay> = new EventEmitter();

  // private readonly MONTH_DATE_FORMAT = 'MMMM yyyy';
  constructor(public calSvc: IonCalendarService) {
    // console.log("CalendarComponent.constructor");
    luxonSettings.defaultLocale = "en";
  }

  ngOnInit(): void {
    this.initOpt();
    this.createWeekOrMonth(new Date().getTime());
    // console.log(">>> monthOpt", this.monthOpt);
  }

  private _selectedDates!: Date | Date[];

  get selectedDates() {
    if (this._selectedDates) {
      return this._selectedDates;
    }

    const dates: Array<Date> = [];
    for (let index = 0; index < this.calendarMonthValue.length; index++) {
      const element = this.calendarMonthValue[index];
      if (element?.time) {
        dates.push(new Date(element.time));
      }
    }
    return dates;
  }
  private set selectedDates(value: Date | Date[]) {
    this._selectedDates = value;
  }

  // get originalDate() {
  //   return this._handleType(this.monthOpt?.original?.time ?? 0);
  // }

  // getDate(date: number) {
  //   return new Date(date);
  // }

  // setViewDate(value: CalendarComponentPayloadType) {
  //   this.createWeekOrMonth(this._payloadToTimeNumber(value));
  // }

  protected switchView(): void {
    this.view = this.view === 'days'
      ? ((this.options.showYearPicker ?? true) ? 'year' : 'month')
      : (this.view === 'year' ? 'month' : 'days');
  }

  switchIcon(): string {
    return this.view === 'days'
      ? 'caret-down'
      : (this.options.showYearPicker ?? true) && this.view === 'year' ? 'caret-down' : 'caret-up';
  }

  protected prev(): void {
    if (this.view === 'days') {
      if (this.def.displayMode === 'week') {
        this.backWeek();
      } else {
        this.backMonth();
      }
    } else if (this.view === 'month') {
      this.prevYear();
    } else {
      this.yearStep -= 1;
    }
  }

  protected next(): void {
    if (this.view === 'days') {
      if (this.def.displayMode === 'week') {
        this.nextWeek();
      } else {
        this.nextMonth();
      }
    } else if (this.view === 'month') {
      this.nextYear();
    } else {
      this.yearStep += 1;
    }
  }

  private prevYear(): void {
    // if (moment(this.monthOpt.original.time).year() === 1970) { return; }
    //const backTime = moment(this.monthOpt.original.time).subtract(1, 'year').valueOf();
    const backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({ year: 1 }).valueOf();
    this.createWeekOrMonth(backTime);
  }

  private nextYear(): void {
    // const nextTime = moment(this.monthOpt.original.time).add(1, 'year').valueOf();
    const nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({ year: 1 }).valueOf();
    this.createWeekOrMonth(nextTime);
  }

  private nextMonth() {
    //const nextTime = moment(this.monthOpt.original.time).add(1, 'months').valueOf();
    const nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({ months: 1 }).valueOf();
    this.onMonthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(nextTime),
    });
    this.monthOpt = this.createMonth(nextTime);
  }

  private nextWeek() {
    let nextTime = DateTime.fromMillis(this.monthOpt.original.time).plus({ weeks: this.def.weeks }).valueOf();
    let newWeek = this.calSvc.multiFormat(nextTime);
    const oldWeek = this.calSvc.multiFormat(this.monthOpt.original.time);

    if (oldWeek.month != newWeek.month && !this.def.continuous) {
      nextTime = DateTime.fromMillis(nextTime).set({ day: 1 }).valueOf();
      newWeek = this.calSvc.multiFormat(nextTime);
    }

    this.monthOpt = this.createWeek(nextTime);
    this.onWeekChange.emit({ oldWeek: oldWeek, newWeek: this.calSvc.multiFormat(this.monthOpt.original.time), });

    if (oldWeek.month != newWeek.month) {
      this.onMonthChange.emit({ oldMonth: oldWeek, newMonth: this.calSvc.multiFormat(this.monthOpt.original.time), });
    }
  }


  canNext(): boolean {
    if (!this.def.to || this.view !== 'days') return true;

    const toDate = DateTimeHelper.parse(this.def.to);
    return this.monthOpt.original.lastDay < toDate.toMillis();
  }

  private backMonth(): void {
    const backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({ months: 1 }).valueOf();
    this.onMonthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(backTime),
    });
    this.monthOpt = this.createMonth(backTime);
  }

  private backWeek(): void {
    let backTime = DateTime.fromMillis(this.monthOpt.original.time).minus({ weeks: this.def.weeks }).valueOf();
    let newWeek = this.calSvc.multiFormat(backTime);
    const oldWeek = this.calSvc.multiFormat(this.monthOpt.original.time);

    if (oldWeek.month != newWeek.month && !this.def.continuous) {
      const start = new Date(this.monthOpt.original.time);
      let dayToSubstrac = start.getDay();
      if (this.options.weekStart === 1) {
        dayToSubstrac--;
        if (dayToSubstrac < 0) {
          dayToSubstrac = 6;
        }
      }

      const firstDayMonth = new Date(start.getFullYear(), start.getMonth(), 1).getTime();
      let momentBackTime = DateTime.fromMillis(firstDayMonth);
      if (start.getDate() - dayToSubstrac <= 1) {
        momentBackTime = momentBackTime.minus({ days: 1 });
      }
      backTime = momentBackTime.valueOf();

      newWeek = this.calSvc.multiFormat(backTime);
    }

    this.onWeekChange.emit({ oldWeek: oldWeek, newWeek: newWeek, });

    if (oldWeek.month != newWeek.month) {
      this.onMonthChange.emit({ oldMonth: oldWeek, newMonth: newWeek, });
    }

    this.monthOpt = this.createWeek(backTime);
  }

  canPrev(): boolean {
    if (!this.def.from || this.view !== 'days') return true;

    const fromDate = DateTimeHelper.parse(this.def.from);
    return this.monthOpt.original.time > fromDate.valueOf();
  }

  onMonthSelect(month: number): void {
    this.view = 'days';

    const newMonth = DateTimeHelper.parse(this.monthOpt.original.time).set({ month }).valueOf();
    this.onMonthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newMonth),
    });
    this.createWeekOrMonth(newMonth);
  }

  public onYearSelect(year: number): void {
    this.view = 'month';

    const newYear = DateTimeHelper.parse(this.monthOpt.original.time).set({ year }).valueOf();
    this.onMonthChange.emit({
      oldMonth: this.calSvc.multiFormat(this.monthOpt.original.time),
      newMonth: this.calSvc.multiFormat(newYear),
    });
    this.monthOpt = this.createMonth(newYear);
  }

  protected onChanged($event: ICalendarDay[]): void {
    const eCD: ICalendarDay[] = $event;

    this.yearStep = 0;

    const emitOnChange = (date: CalendarComponentOnChangeType) => {
      this._onChanged(date);
      this.onChange.emit(date);
    }

    switch (this.def.pickMode) {
      case pickModes.single:
        const time = eCD[0].time;
        const date = this._handleType(time);

        this.selectedDates = DateTimeHelper.parse(time).toJSDate();
        emitOnChange(date);
        break;

      case pickModes.range:
        if (eCD[0] && eCD[1]) {
          const timeFrom = eCD[0].time;
          const timeTo = eCD[1].time;

          const rangeDate: CalendarComponentPayloadRangeType = {
            from: this._handleType(timeFrom),
            to: this._handleType(timeTo),
          };

          this.selectedDates = Array<Date>(
            DateTimeHelper.parse(timeFrom).toJSDate(),
            DateTimeHelper.parse(timeTo).toJSDate()
          );

          emitOnChange(rangeDate);
        }
        break;

      case pickModes.multi:
        const emitChangeForMulti = (days: ICalendarDay[]): Array<Date> => {
          const dates: Array<Date> = [];

          const payloads: Array<CalendarComponentPayloadType> = [];
          for (let i = 0; i < days.length; i++) {
            if (days[i] && days[i].time) {
              const time = days[i].time;
              const payload = this._handleType(time);
              payloads.push(payload);
              dates.push(DateTimeHelper.parse(time).toJSDate());
            }
          }

          emitOnChange(payloads);
          return dates
        }
        this.selectedDates = emitChangeForMulti(eCD);
        break;

      default:
    }
  }

  // onSwipe($event: any): void {
  //   console.log('onSwipe', $event); // TODO remove debug
  //   const isNext = $event.deltaX < 0;
  //   if (isNext && this.canNext()) {
  //     this.nextMonth();
  //   } else if (!isNext && this.canPrev()) {
  //     this.backMonth();
  //   }
  // }

  private _onChanged: Function = () => { };
  private _onTouched: Function = () => { };

  private _payloadToTimeNumber(value: CalendarComponentPayloadType): number {
    // let date;
    // if (this.type === 'string') {
    //   date = moment(value, this.format);
    // } else {
    //   date = moment(value);
    // }

    // const date = this.type === 'string'
    const date = typeof value === 'string'
      ? DateTime.fromFormat(value as string, this.format.replace(/Y/g, 'y'))
      : DateTimeHelper.parse(value);

    return date.valueOf();
  }

  monthFormat(date: number): string {
    if (!this.def.monthFormat) return '';
    // return moment(date).format(this.def.monthFormat.replace(/y/g, 'Y'));
    return DateTimeHelper.parse(date).toFormat(this.def.monthFormat.replace(/Y/g, 'y'), { locale: this._options.locale?.locale });
  }

  private initOpt(): void {
    this.showToggleButtons = this._options.showToggleButtons ?? true;
    this.showMonthPicker = this._options.showMonthPicker ?? true;

    if (this.view !== 'days' && !this.showMonthPicker) {
      this.view = 'days';
    }

    if (this.color && this.color !== this.options.color) {
      this.options.color = this.color;
    }

    this.def = this.calSvc.safeOpt(this._options);
    this._options = {
      ...this._options,
      ...this.def,
    }

    const locale = this._options.locale?.locale || "en";
    luxonSettings.defaultLocale = locale;

    this._monthsTitle = this._options.monthsTitle ?? DateTimeHelper.monthsShortTitle(locale);
  }

  private createWeekOrMonth(time: number) {
    if (this.def.displayMode === 'week') {
      this.monthOpt = this.createWeek(time);
    } else {
      this.monthOpt = this.createMonth(time);
    }
  }

  private createWeek(date: number): ICalendarMonth {
    const period = this.calSvc.createWeeksByPeriod(date, this.def);
    return period[0];
  }
  private createMonth(date: number): ICalendarMonth {
    const period = this.calSvc.createMonthsByPeriod(date, 1, this.def);
    return period[0];
  }

  private _createCalendarDay(value: CalendarComponentPayloadType): ICalendarDay {
    return this.calSvc.createCalendarDay(this._payloadToTimeNumber(value), this.def);
  }

  private _handleType(value: number): CalendarComponentPayloadType {
    // const date = moment(value);
    const date = DateTimeHelper.parse(value);
    switch (this.type) {
      case 'time':
        return date.valueOf();
      case 'js-date':
        return date.toJSDate();
      case 'object':
        return date.toObject();
      case 'luxon':
        return date;
      case 'string':
      default:
        return date.toFormat(this.format.replace(/Y/g, 'y'));
    }
  }

  writeValue(obj: any): void {
    this._writeValue(obj);
    if (obj) {
      if (this.calendarMonthValue[0]) {
        //this.monthOpt = this.createMonth(this._calendarMonthValue[0].time);
        if (!Number.isNaN(this.calendarMonthValue[0].time))
          this.createWeekOrMonth(this.calendarMonthValue[0].time);
      } else {
        // this.monthOpt = this.createMonth(new Date().getTime());
        this.createWeekOrMonth(new Date().getTime());
      }
    }
  }

  registerOnChange(fn: () => {}): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  private _writeValue(value: CalendarComponentOnChangeType): void {
    if (!value) {
      this.calendarMonthValue = [null, null];
      return;
    }

    this.onChange.emit(value);

    switch (this.def.pickMode) {
      case 'single':
        this.calendarMonthValue[0] = this._createCalendarDay(value as CalendarComponentPayloadType);
        break;

      case 'range':
        const { from, to } = value as CalendarComponentPayloadRangeType;
        this.calendarMonthValue[0] = from ? this._createCalendarDay(from) : null;
        this.calendarMonthValue[1] = to ? this._createCalendarDay(to) : null;
        break;

      case 'multi':
        if (Array.isArray(value)) {
          this.calendarMonthValue = value.map(e => {
            return this._createCalendarDay(e);
          });
        } else {
          this.calendarMonthValue = [null, null];
        }
        break;

      default:
    }
  }
}
