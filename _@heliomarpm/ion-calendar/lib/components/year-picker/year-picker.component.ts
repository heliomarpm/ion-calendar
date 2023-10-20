import { Component, EventEmitter, Input, Output } from '@angular/core';
import defaultValues from '../../types';

@Component({
  selector: 'ion-year-picker',
  templateUrl: './year-picker.component.html',
  styleUrls: ['./year-picker.component.scss']
})
export class YearPickerComponent {
  _thisYear = new Date();
  _yearRanges: number[] = [];

  private _year: number = new Date().getFullYear();
  get year(): number {
    return this._year;
  }
  @Input() set year(value: number) {
    this._year = value;
  }

  private _yearStep: number = 0;
  get yearStep(): number {
    return this._yearStep;
  }
  @Input() set yearStep(value: number) {
    if (this._year) {
      this._yearStep = value;
      this.setYearRanges(this.year, value);
    }
  }

  @Input() color = defaultValues.COLOR;
  @Output() onSelect: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log("YearPickerComponent.Constructor");
    this.setYearRanges(this._thisYear.getFullYear(), 0);
  }

  private setYearRanges(year: number, step: number) {
    const yearBase = year + (step * 15);
    const start = yearBase - 7;
    const end = yearBase + 7;

    this._yearRanges = [];
    for (var i = start; i <= end; i++) {
      this._yearRanges.push(i);
    }
  }

  _onSelect(year: number): void {
    this.onSelect.emit(year);
  }

  ngOnChanges(changes: any) {
    if (changes.year) {
      this._year = changes.year.currentValue;
      this.setYearRanges(this._year, 0);
    }
  }
}
