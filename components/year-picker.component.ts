import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarMonth } from '../calendar.models';
import { defaults } from '../utils/config';

@Component({
  selector: 'ion-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent {
  @Input()
  year!: CalendarMonth;

  @Input()
  color = defaults.COLOR;

  @Output()
  select: EventEmitter<number> = new EventEmitter();

  _thisYear = new Date();
  _yearFormat: string[];

  YEAR_FORMAT = 'YYYY';

  @Input()
  set yearFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._yearFormat = value;
    }
  }
  get yearFormat(): string[] {
    return this._yearFormat;
  }

  constructor() {}

  _onSelect(year: number): void {
    this.select.emit(year);
  }

  getDate(year: number) {
    return new Date(year, 0, 1);
  }
}
