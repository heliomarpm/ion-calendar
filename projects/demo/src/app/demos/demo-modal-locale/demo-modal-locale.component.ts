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
  weekDays: string[] = [];

  constructor(public modalCtrl: ModalController) { }

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'Locale: pt-BR | monthFormat: MMMM, yy',
      defaultDate: this.date,
      monthFormat: 'MMMM, yy',
      // weekdays: this.weekDays,
      weekStart: 0,
      doneLabel: "Confirmar",
      closeLabel: "Cancelar",
      locale: {
        locale: 'pt-Br',
        weekdays: 'initial',
        // startWeek: 'sunday'
      },
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
