import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { CalendarComponent, ICalendarComponentOptions, ICalendarLocale } from '@heliomarpm/ion-calendar';
import { ColorType, PickModeType } from '@heliomarpm/ion-calendar/lib/types';

@Component({
  selector: 'app-demo-basic',
  templateUrl: './demo-basic.component.html',
  styleUrls: ['./demo-basic.component.scss'],
})
export class DemoBasicComponent {
  @ViewChild('calendar', { read: CalendarComponent })
  calendarRef!: CalendarComponent;

  events!: {};
  LOCALE_BR = "pt-Br";
  LOCALE_CN = "zh-cn";

  formatMonthPicker: boolean = false;
  formatWeekDays: boolean = false;

  date!: string | Date | number;
  format = 'yyyy-MM-dd';
  readonly = false;

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

  constructor(
    private toastCtrl: ToastController) {
    this.setDateToday()
  }

  setDateToday() {
    const today = new Date();
    this.format = 'yyyy-MM-dd';
    this.date = today.toISOString().substring(0, 10);
  }
  async selectedDates() {
    const dates = this.calendarRef.selectedDates;
    console.log('view date', dates);

    const toast = await this.toastCtrl.create({
      message: `view date: ${JSON.stringify(dates, null, 2)}`,
      duration: 2000,
    });
    toast.present();
  }

  async _toastWrap(event: string, payload: {}) {
    const toast = await this.toastCtrl.create({
      message: `${event}: ${JSON.stringify(payload, null, 2)}`,
      duration: 2000,
    });
    toast.present();
  }

  setLocaleBR() {
    // luxon.Settings.defaultLocale = this.locale;
    // // const monthsTitle = luxon.Info.months('short');
    // const weekdays = luxon.Info.weekdays('short').map(d => d.replace('.', ''));

    // if (weekdays[0] == 'seg') {
    //   const lastElement = weekdays.pop()!;
    //   weekdays.unshift(lastElement);
    // }
    const locale: ICalendarLocale = {
      locale: this.LOCALE_BR,
      weekdays: 'initial',
      // startWeek: 'sunday'
    };

    this.options = {
      ...this.options,
      // monthsTitle,
      // weekdays,
      locale
    };

  }
  setLocaleCN() {
    // luxon.Settings.defaultLocale = this.locale;
    // // const monthsTitle = luxon.Info.months('short');
    // const weekdays = luxon.Info.weekdays('short').map(d => d.replace('.', ''));

    // if (weekdays[0] == 'seg') {
    //   const lastElement = weekdays.pop()!;
    //   weekdays.unshift(lastElement);
    // }

    const locale: ICalendarLocale = {
      locale: this.LOCALE_CN,
      weekdays: 'short',
      // startWeek: 'sunday'
    };

    this.options = {
      ...this.options,
      // monthsTitle,
      // weekdays,
      locale,
    };

  }

  onChange(event: any) {
    console.log('onChange', event);
    this.events = {
      ...this.events,
      onChange: { event },
    };
  }
  onMonthChange(event: any) {
    console.log('onMonthChange', event);
    this.events = {
      ...this.events,
      onMonthChange: { event },
    };
  }
  onWeekChange(event: any) {
    console.log('onWeekChange', event);
    this.events = {
      ...this.events,
      onWeekChange: { event },
    };
  }
  onSelect(event: any) {
    console.log('onSelect', event);
    this.events = {
      ...this.events,
      onSelect: { event },
    };
  }
  onSelectStart(event: any) {
    console.log('onSelectStart', event);
    this.events = {
      ...this.events,
      onSelectStart: { event },
    };
  }
  onSelectEnd(event: any) {
    console.log('onSelectEnd', event);
    this.events = {
      ...this.events,
      onSelectEnd: { event },
    };
  }

  onChangePickMode(pickMode: PickModeType) {
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


  onChangeColors(color: ColorType) {
    this.options = {
      ...this.options,
      color,
    };
  }

  onChangeColorsSubtitle(colorSubtitle: ColorType) {
    this.options = {
      ...this.options,
      colorSubtitle,
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
      showYearPicker
    };
  }


  onChangeWeekStart(weekStart: 0 | 1) {
    this.options = {
      ...this.options,
      weekStart: weekStart,
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

  onChangeShowAdjacentMonthDay(showAdjacentMonthDay: boolean) {
    this.options = {
      ...this.options,
      showAdjacentMonthDay
    };
  }

  onChangeShowMonthAdjacentDays(showMonthAdjacentDays: boolean) {
    this.options = {
      ...this.options,
      showMonthAdjacentDays
    };
  }

  onChangemonthsTitle(change: boolean) {
    if (change) {
      this.options = {
        ...this.options,
        monthsTitle: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      }
    }
    else {
      delete this.options.monthsTitle;
      this.options = {
        ...this.options
      }
    }
  }

  onChangeWeekDays(change: boolean) {
    if (change) {
      const weekdays = this.options.weekStart ?? 0 == 0
        ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

      this.options = {
        ...this.options,
        weekdays
      }
    }
    else {
      delete this.options.weekdays;
      this.options = {
        ...this.options
      }

    }
  }

}
