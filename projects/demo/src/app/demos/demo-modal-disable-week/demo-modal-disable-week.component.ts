import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-disable-week',
  templateUrl: './demo-modal-disable-week.component.html',
  styleUrls: ['./demo-modal-disable-week.component.scss'],
})
export class DemoModalDisableWeekComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'DISABLE DAYS (S, W, S)',
      defaultDate: this.date,
      disableWeeks: [0, 3, 6],
      color: 'danger'
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
