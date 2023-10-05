import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as luxon from 'luxon';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-locale',
  templateUrl: './demo-modal-locale.component.html',
  styleUrls: ['./demo-modal-locale.component.scss'],
})
export class DemoModalLocaleComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) {
    //moment.locale('zh-cn');
    luxon.Settings.defaultLocale = 'zh-cn';
  }

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'LOCALE',
      defaultDate: this.date,
      monthFormat: 'yyyy 年 MM 月',
      weekdays: luxon.Info.weekdays('short').map(d => d.replace('.', '')), //moment.weekdaysShort(),
      weekStart: 1,
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
