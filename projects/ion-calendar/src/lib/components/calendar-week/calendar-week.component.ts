import { Component, Input } from '@angular/core';
import defaultValues from '../../types';


@Component({
  selector: 'ion-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent {
  private _weekArray: string[] = defaultValues.WEEKS_FORMAT;
  private _weekStart = 0;

  displayWeekArray: string[] = this._weekArray;

  @Input()
  color: string = defaultValues.COLOR;

  constructor() {}

  @Input()
  set weekArray(value: string[]) {
    if (value && value.length === 7) {
      this._weekArray = [...value];
      this.adjustSort();
    }
  }

  @Input()
  set weekStart(value: number) {
    if (value === 0 || value === 1) {
      this._weekStart = value;
      this.adjustSort();
    }
  }

  private adjustSort(): void {
    if (this._weekStart === 1) {
      const cacheWeekArray = [...this._weekArray];
      cacheWeekArray.push(cacheWeekArray.shift()!);
      this.displayWeekArray = [...cacheWeekArray];

    } else if (this._weekStart === 0) {
      this.displayWeekArray = [...this._weekArray];
    }
  }
}
