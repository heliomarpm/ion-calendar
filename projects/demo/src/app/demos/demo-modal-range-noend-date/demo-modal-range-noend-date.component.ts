import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-range-noend-date',
  templateUrl: './demo-modal-range-noend-date.component.html',
  styleUrls: ['./demo-modal-range-noend-date.component.scss'],
})
export class DemoModalRangeNoEndDateComponent {
  dateRange: {
    from: Date;
  } = {
    from: new Date(),
  };

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE - NO DEFINED END DATE',
      defaultDateRange: this.dateRange,
      color: "medium"
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
