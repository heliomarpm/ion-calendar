/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

import { CalendarModalOptions } from 'projects/ion-calendar/src/lib';
import { CalendarModalComponent } from 'projects/ion-calendar/src/lib/components/calendar-modal.component';

@Component({
  selector: 'demo-modal-locale',
  template: `
    <ion-button (click)="openCalendar()">
      locale
    </ion-button>
  `,
})
export class DemoModalLocaleComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) {
    moment.locale('zh-cn');
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'LOCALE',
      defaultDate: this.date,
      monthFormat: 'yyyy 年 MM 月',
      weekdays: moment.weekdaysShort(),
      weekStart: 1,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModalComponent,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const { data: date, role } = event;

    if (role === 'done') {
      this.date = date.dateObj;
    }
    console.log(date);
    console.log('role', role);
  }
}
