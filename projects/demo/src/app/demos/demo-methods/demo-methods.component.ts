import { Component, ViewChild } from '@angular/core';
import { ToastController } from '@ionic/angular';

import { CalendarComponent, ICalendarComponentOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-methods',
  templateUrl: './demo-methods.component.html',
  styleUrls: ['./demo-methods.component.scss'],
})
export class DemoMethodsComponent  {
  @ViewChild('calendar', { read: CalendarComponent })
  calendarRef!: CalendarComponent;

  date: {
    from: string;
    to: string;
  } = {
    from: '2018-01-15',
    to: '2018-01-25',
  };
  options: ICalendarComponentOptions = {
    from: new Date(2000, 0, 1),
    pickMode: 'range',
  };

  constructor(private toastCtrl: ToastController) {}

  async _toastWrap(event: string, payload: {}) {
    const toast = await this.toastCtrl.create({
      message: `${event}: ${JSON.stringify(payload, null, 2)}`,
      duration: 2000,
    });
    toast.present();
  }

  onChange($event: any) {
    console.log('onChange', $event);
  }

  getCalendarViewDate() {
    console.log(this.calendarRef);
    this._toastWrap('view date', this.calendarRef.getViewDate());
    console.log('view date', this.calendarRef.getViewDate());
  }

  serCalendarViewDate() {
    this.calendarRef.setViewDate('2018-02-01');
  }
}
