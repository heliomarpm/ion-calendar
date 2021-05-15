/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalOptions } from 'projects/ion-calendar/src/lib';
import { CalendarModalComponent } from 'projects/ion-calendar/src/lib/components/calendar-modal.component';

@Component({
  selector: 'demo-modal-default-scroll',
  template: `
    <ion-button (click)="openCalendar()">
      default-scroll-to
    </ion-button>
  `,
})
export class DemoModalDefaultScrollComponent {
  date: Date = new Date(2017, 4, 1);

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: CalendarModalOptions = {
      title: 'DEFAULT SCROLL',
      from: new Date(2017, 1, 1),
      defaultScrollTo: this.date,
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
