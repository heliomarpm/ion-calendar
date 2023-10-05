import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions, IDayConfig } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-config-days',
  templateUrl: './demo-modal-config-days.component.html',
  styleUrls: ['./demo-modal-config-days.component.scss'],
})
export class DemoModalConfigDaysComponent {
  date: Date = new Date(2017, 0, 2);

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const daysConfig: IDayConfig[] = [];
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

    const options: ICalendarModalOptions = {
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
