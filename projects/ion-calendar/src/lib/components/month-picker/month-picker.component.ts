import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICalendarMonth } from '../../models';
import defaultValues from '../../types';


@Component({
  selector: 'ion-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent {
  @Input()
  month!: ICalendarMonth;

  @Input()
  color = defaultValues.COLOR;

  @Output()
  select: EventEmitter<number> = new EventEmitter();

  _thisMonth = new Date();
  _monthFormat = defaultValues.MONTH_FORMAT;

  MONTH_FORMAT = 'MMMM';

  @Input()
  set monthFormat(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._monthFormat = value;
    }
  }
  get monthFormat(): string[] {
    return this._monthFormat;
  }

  constructor() { }

  _onSelect(month: number): void {
    this.select.emit(month);
  }

  getDate(month: number) {
    return new Date(this._thisMonth.getFullYear(), month, 1);
  }

  get monthSelected(): number {
    return this.month.original.month;
  }
}
