import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICalendarMonth } from '../../models';
import defaultValues from '../../types';
import { DateTimeHelper } from '../../helpers';

@Component({
  selector: 'ion-month-picker',
  templateUrl: './month-picker.component.html',
  styleUrls: ['./month-picker.component.scss']
})
export class MonthPickerComponent {
  _thisMonth = new Date();
  _monthsTitle = DateTimeHelper.monthsShortTitle();
  MONTH_FORMAT = 'MMMM';

  @Input() month!: ICalendarMonth;
  @Input() color = defaultValues.COLOR;
  @Output() onSelect: EventEmitter<number> = new EventEmitter();

  @Input() set monthsTitle(value: string[]) {
    if (Array.isArray(value) && value.length === 12) {
      this._monthsTitle = value;
    }
  }
  get monthsTitle(): string[] {
    return this._monthsTitle;
  }

  constructor() {
    // console.log("MonthPickerComponent.constructor");
  }

  _onSelect(month: number): void {
    this.onSelect.emit(month);
  }

  getDate(month: number) {
    return new Date(this._thisMonth.getFullYear(), month, 1);
  }

  get monthSelected(): number {
    return this.month.original.month;
  }
}
