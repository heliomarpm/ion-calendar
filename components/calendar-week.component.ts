import { Component, Input } from '@angular/core';
import { defaults } from '../utils/config';
@Component({
  selector: 'ion-calendar-week',
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent {
  _weekArray: string[] = defaults.WEEKS_FORMAT;
  _displayWeekArray: string[] = this._weekArray;
  _weekStart = 0;
  @Input()
  color: string = defaults.COLOR;

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

  adjustSort(): void {
    const cacheWeekArray = [...this._weekArray];

    if (this._weekStart === 1) {
      cacheWeekArray.push(cacheWeekArray.shift());
    }

    this._displayWeekArray = [...cacheWeekArray];
  }
}
