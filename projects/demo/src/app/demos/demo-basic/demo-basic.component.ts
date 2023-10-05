import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarComponentOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-basic',
  templateUrl: './demo-basic.component.html',
  styleUrls: ['./demo-basic.component.scss'],
})
export class DemoBasicComponent {
  _formatMonthPicker: boolean = false;
  _formatWeekDays: boolean = false;

  date!: string | Date | number;
  format = 'yyyy-MM-dd';

  optModel: ICalendarComponentOptions = {
    from: new Date().getTime(),
    pickMode: 'single',
    color: 'primary',
    weekStart: 0,
    showToggleButtons: true,
    showMonthPicker: true,
    showYearPicker: true,
    showAdjacentMonthDay: true,
    displayMode: 'month',
  }
  options: ICalendarComponentOptions = {
    // from: new Date(100, -1188, 1),
    // to: new Date(2023,10,1),
  };

  constructor(public modalCtrl: ModalController) {
    this.setDateToday()
  }

  setDateToday() {
    const today = new Date();
    this.format = 'yyyy-MM-dd';
    this.date = today.toISOString().substring(0, 10);
  }

  onChange($event: any) {
    console.log($event);
  }

  onChangePickMode(pickMode: string) {
    this.options = {
      ...this.options,
      pickMode,
    };
  }

  onChangeFrom(from: Date) {
    console.log("onChangeFrom", from);
    this.options = {
      ...this.options,
      from,
    };
    console.log(this.options);
  }

  onChangeTo(to: Date) {
    console.log("onChangeFrom", to);
    this.options = {
      ...this.options,
      to,
    };
    console.log(this.options);
  }


  onChangeColors(color: string) {
    this.options = {
      ...this.options,
      color,
    };
  }

  onChangeDisableWeeks(disableWeeks: string[]) {
    this.options = {
      ...this.options,
      disableWeeks: disableWeeks.map(e => parseInt(e, 10)),
    };
  }

  onChangeShowToggleButtons(showToggleButtons: boolean) {
    this.options = {
      ...this.options,
      showToggleButtons,
    };
  }

  onChangeShowMonthPicker(showMonthPicker: boolean) {
    this.options = {
      ...this.options,
      showMonthPicker,
    };
  }
  onChangeShowYearPicker(showYearPicker: boolean) {
    this.options = {
      ...this.options,
      showYearPicker,
    };
  }


  onChangeWeekStart(weekStart: string) {
    this.options = {
      ...this.options,
      weekStart: parseInt(weekStart, 10),
    };
  }

  onChangeDisplayMode(displayMode: 'week' | 'month') {
    this.options = {
      ...this.options,
      displayMode
    };
  }

  onChangeNumberWeeks(weeks: number) {
    if (weeks > 0) {
      this.options = {
        ...this.options,
        weeks
      };
    }
  }

  onChangeContinuous(continuous: boolean) {
    this.options = {
      ...this.options,
      continuous
    };
  }

  onChangeShowAdjacentMonthDay(showAdjacentMonthDay: boolean) {
    this.options = {
      ...this.options,
      showAdjacentMonthDay
    };
  }

  onChangeMonthPickerFormat(change: boolean) {
    if (change) {
      this.options = {
        ...this.options,
        monthPickerFormat: ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"]
      }
    }
    else {
      this.options = {
        ...this.options,
        monthPickerFormat: []
      }

    }
  }
  onChangeWeekDays(change: boolean) {
    if (change) {
      this.options = {
        ...this.options,
        weekdays: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
      }
    }
    else {
      this.options = {
        ...this.options,
        weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      }

    }
  }

}
