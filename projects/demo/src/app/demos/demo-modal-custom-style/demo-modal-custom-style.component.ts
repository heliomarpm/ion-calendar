import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalendarModalComponent, ICalendarModalOptions, ICalendarResult } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-modal-custom-style',
  templateUrl: './demo-modal-custom-style.component.html',
  styleUrls: ['./demo-modal-custom-style.component.scss'],
})
export class DemoModalCustomStyleComponent {
  date: Date = new Date();

  constructor(public modalCtrl: ModalController) { }

  async openCalendar() {
    const options: ICalendarModalOptions = {
      title: 'CUSTOM STYLE',
      defaultDate: this.date,
      cssClass: 'my-class',
      color: 'custom',
      doneIcon: true,
      closeIcon: true,
      titlePosition: 'bottom',
      actionsPosition: 'bottom',
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModalComponent,
      componentProps: { options },
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const { data, role } = event;

    if (role === 'done') {
      const date = data as ICalendarResult;
      this.date = date.dateObj;

      alert(`date: ${date.string}\n\n role: ${role}`);
    }

    console.log('date', data);
    console.log('role', role);
  }
}
