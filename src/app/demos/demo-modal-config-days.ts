/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalOptions, DayConfig } from 'projects/ion-calendar/src/lib';
import { CalendarModalComponent } from 'projects/ion-calendar/src/lib/components/calendar-modal.component';

@Component({
  selector: 'demo-modal-config-days',
  template: `
    <ion-button (click)="openCalendar()">
      config-days
    </ion-button>
  `,
})
export class DemoModalConfigDaysComponent {
  date: Date = new Date(2017, 0, 2);

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const daysConfig: DayConfig[] = [];
    for (let i = 1; i < 30; i++) {
      daysConfig.push({
        date: new Date(2017, 0, i + 1),
        subTitle: `$${i + 1}`,
      });
    }
    daysConfig.push({
      date: new Date(2017, 1, 1),
      disable: true,
      subTitle: 'disable',
    });
    daysConfig.push({
      date: new Date(2017, 0, 1),
      subTitle: 'New Year\'s',
      cssClass: 'my-day',
    });

    const options: CalendarModalOptions = {
      daysConfig,
      from: new Date(2017, 0, 1),
      to: new Date(2017, 11.1),
      title: 'CONFIG DAYS',
      defaultDate: this.date,
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
