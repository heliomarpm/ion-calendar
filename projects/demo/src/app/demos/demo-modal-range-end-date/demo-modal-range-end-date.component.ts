import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-range-end-date',
  templateUrl: './demo-modal-range-end-date.component.html',
  styleUrls: ['./demo-modal-range-end-date.component.scss'],
})
export class DemoModalRangeEndDateComponent {
  dateRange: {
    from: Date;
  } = {
    from: new Date(),
  };

  constructor(public modalCtrl: ModalController) {}

  async openCalendar() {
    const options: ICalendarModalOptions = {
      pickMode: 'range',
      title: 'RANGE - END DATE',
      defaultDateRange: this.dateRange,
      color: "secondary"
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
