import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarModalOptions } from '@heliomarpm/ion-calendar';
import { SubHeaderCalendarModal } from './sub-header-calendar-modal';

@Component({
  selector: 'app-demo-modal-custom-sub-header',
  templateUrl: './demo-modal-custom-sub-header.component.html',
  styleUrls: ['./demo-modal-custom-sub-header.component.scss'],
})
export class DemoModalCustomSubHeaderComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'Custom Sub Header',
      defaultDate: this.date,
      canBackwardsSelected: true,
    };

    const myCalendar = await this.modalCtrl.create({
      component: SubHeaderCalendarModal,
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
