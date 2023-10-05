import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarComponentOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-multi',
  templateUrl: './demo-multi.component.html',
  styleUrls: ['./demo-multi.component.scss'],
})
export class DemoMultiComponent {
  date: string[] = ['2018-01-01', '2018-01-02', '2018-01-05'];
  options: ICalendarComponentOptions = {
    from: new Date(2000, 0, 1),
    pickMode: 'multi',
  };

  constructor(public modalCtrl: ModalController) {}

  onChange($event: any) {
    console.log($event);
  }
}
