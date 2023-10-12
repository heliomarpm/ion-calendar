import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions, ICalendarResult } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-multi',
  templateUrl: './demo-modal-multi.component.html',
  styleUrls: ['./demo-modal-multi.component.scss'],
})
export class DemoModalMultiComponent {
  dates: Date[] = [
    new Date(),
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    new Date(Date.now() + 24 * 60 * 60 * 1000 * 2),
  ];

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
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
      this.dates = [...dates.map((e: ICalendarResult) => e.dateObj)];
    }
    console.log(dates);
    console.log(role);
  }
}
