import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-custom-style',
  templateUrl: './demo-modal-custom-style.component.html',
  styleUrls: ['./demo-modal-custom-style.component.scss'],
})
export class DemoModalCustomStyleComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'CUSTOM-STYLE',
      defaultDate: this.date,
      cssClass: 'my-class',
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
