import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaults } from '../utils/config';

@Component({
  selector: 'ion-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent {
  _thisYear = new Date();
  _yearRanges = [ ];

  private _year: number;
  get year(): number {
    return this._year;
  }
  @Input()
  set year(value: number) {
    this._year = value;
  }

  private _yearStep: number;
  get yearStep(): number {
    return this._yearStep;
  }
  @Input()
  set yearStep(value: number) {
    if (this._year) {
      this._yearStep = value;
      this.setYearRanges(this.year, value);
     }
  }

  @Input()
  color = defaults.COLOR;

  @Output()
  select: EventEmitter<number> = new EventEmitter();

  constructor() {
    this.setYearRanges(this._thisYear.getFullYear(), 0);
  }

  private setYearRanges(year: number, step: number) {
    const yearBase = year + step;
    const start = yearBase - 7;
    const end = yearBase + 7;

    this._yearRanges = [];
    for (var i = start; i <= end; i++) {
      this._yearRanges.push(i);
    }
  }

  _onSelect(year: number): void {
    this.select.emit(year);
  }

  ngOnChanges(changes: any) {
    if (changes.year) {
      this._year = changes.year.currentValue;
      this.setYearRanges(this._year, 0);
    }
  }
}
