import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-default-scroll',
  templateUrl: './demo-modal-default-scroll.component.html',
  styleUrls: ['./demo-modal-default-scroll.component.scss'],
})
export class DemoModalDefaultScrollComponent {
  date: Date = new Date(2017, 4, 1);

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
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
