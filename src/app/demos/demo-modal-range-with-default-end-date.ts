/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalOptions } from 'projects/ion-calendar/src/lib';
import { CalendarModalComponent } from 'projects/ion-calendar/src/lib/components/calendar-modal.component';

@Component({
  selector: 'demo-range-with-default-end-date',
  template: `
    <ion-button (click)="openCalendar()">
      end date defaulted to start date
    </ion-button>
  `,
})
export class DemoModalRangeWithDefaultEndDate {
  dateRange: {
    from: Date;
  } = {
    from: new Date(),
  };

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE',
      defaultDateRange: this.dateRange,
      defaultEndDateToStartDate: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModalComponent,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const { data: date, role } = event;

    if (role === 'done') {
      this.dateRange = Object.assign(
        {},
        {
          from: date.from.dateObj,
          to: date.to.dateObj,
        }
      );
    }
    console.log(date);
    console.log('role', role);
  }
}
