import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarComponentOptions } from '@heliomarpm/ion-calendar';
@Component({
  selector: 'app-demo-options',
  templateUrl: './demo-options.component.html',
  styleUrls: ['./demo-options.component.scss'],
})
export class DemoOptionsComponent {
  _color = 'primary';
  _showToggleButtons = true;
  _showMonthPicker = true;
  _showYearPicker = true;
  _disableWeeks: number[] = [0, 6];
  _weekStart = 0;
  _weeks = 1;
  _continuous = true;  //false;
  _displayMode = 'month';
  _showAdjacentMonthDay = true;
  _pickMode = 'single'
  date = '2018-01-01';
  options: ICalendarComponentOptions = {
    from: new Date(2000, 1, 1),
    // color : this._color,
    // showToggleButtons : this._showToggleButtons,
    // showMonthPicker: this._showMonthPicker,
    // showYearPicker: this._showYearPicker ,
    // disableWeeks: [...this._disableWeeks],
    // weekStart: this._weekStart,
    // weeks: this._weeks ,
    // continuous: this._continuous ,  //false;
    // displayMode: this._displayMode ,
    // showAdjacentMonthDay: this._showAdjacentMonthDay,
    // pickMode: this._pickMode ,
  };
  format = 'DDDD'

  constructor(public modalCtrl: ModalController) { }

  onChange($event: any) {
    console.log($event);
  }

  _changePickMode(pickMode: 'single' | 'range' | 'multi') {
    this.options = {
      ...this.options,
      pickMode,
    };
  }

  _changeColors(color: string) {
    this.options = {
      ...this.options,
      color,
    };
  }

  _changeShowToggleButtons(showToggleButtons: boolean) {
    this.options = {
      ...this.options,
      showToggleButtons,
    };
  }

  _changeShowMonthPicker(showMonthPicker: boolean) {
    this.options = {
      ...this.options,
      showMonthPicker,
    };
  }
  _changeShowYearPicker(showYearPicker: boolean) {
    this.options = {
      ...this.options,
      showYearPicker,
    };
  }

  _changeDisableWeeks(disableWeeks: string[]) {
    this.options = {
      ...this.options,
      disableWeeks: disableWeeks.map(e => parseInt(e, 10)),
    };
  }

  _changeWeekStart(weekStart: string) {
    this.options = {
      ...this.options,
      weekStart: parseInt(weekStart, 10),
    };
  }

  _changeDisplayMode(displayMode: 'week' | 'month' ) {
      this.options = {
        ...this.options,
        displayMode
      };
  }

  _changeNumberWeeks(weeks: number) {
    if (weeks > 0) {
      this.options = {
        ...this.options,
        weeks
      };
    }
  }

  _changeContinuous(continuous: boolean) {
    this.options = {
      ...this.options,
      continuous
    };
  }

  _changeShowAdjacentMonthDay(showAdjacentMonthDay: boolean) {
    this.options = {
      ...this.options,
      showAdjacentMonthDay
    };
  }

  setDateToday() {
    const today = new Date();
    this.date = today.toISOString().substring(0, 10);
  }
}
