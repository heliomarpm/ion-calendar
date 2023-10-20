import { Component, Input } from '@angular/core';
import defaultValues, { ColorType } from '../../types';
import { DateTimeHelper } from '../../helpers';


@Component({
  selector: 'ion-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent {
  private WEEKDAYS = DateTimeHelper.weekDays();
  private _weekDaysOld: string[] = this.WEEKDAYS;
  private _weekDays: string[] = this.WEEKDAYS;
  private _weekStart = 0;

  public displayWeekDays: string[] = this._weekDays;

  @Input() color: ColorType | undefined = defaultValues.COLOR as ColorType;

  constructor() {
    // console.log("CalendarWeekComponent.constructor");
  }

  @Input()
  set weekDays(value: string[] | undefined) {
    if (value && value.length === 7) {
      this._weekDays = [...value];
      this.adjustSort(this._weekStart);
    }
  }

  @Input()
  set weekStart(value: number) {
    this.adjustSort(value);
  }

  private adjustSort(weekStart: number): void {
    if (weekStart == this._weekStart && this.isEquals(this._weekDays, this._weekDaysOld)) return;

    if (weekStart == 1) {
      const cacheWeekArray = [...this._weekDays];
      cacheWeekArray.push(cacheWeekArray.shift()!);
      this.displayWeekDays = [...cacheWeekArray];

    } else {
      this.displayWeekDays = [...this._weekDays];
    }

    this._weekDaysOld = Array.from(this._weekDays);
    this._weekStart = weekStart;
  }

  private isEquals(a: Array<any>, b: Array<any>): boolean {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch (error) {
      return false;
    }
  }
}
