/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalOptions } from 'projects/ion-calendar/src/lib';
import { CalendarModalComponent } from 'projects/ion-calendar/src/lib/components/calendar-modal.component';

@Component({
  selector: 'demo-modal-multi',
  template: `
    <ion-button (click)="openCalendar()">
      multi
    </ion-button>
  `,
})
export class DemoModalMultiComponent {
  dates: Date[] = [
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    new Date(Date.now() + 24 * 60 * 60 * 1000 * 2),
  ];

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'multi',
      title: 'MULTI',
      defaultDates: this.dates,
      clearLabel: 'CLEAR'
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModalComponent,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const { data: dates, role } = event;

    if (role === 'done') {
      this.dates = [...dates.map(e => e.dateObj)];
    }
    console.log(dates);
    console.log(role);
  }
}
