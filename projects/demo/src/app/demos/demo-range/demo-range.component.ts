import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ICalendarComponentOptions } from '@heliomarpm/ion-calendar';

@Component({
  selector: 'app-demo-range',
  templateUrl: './demo-range.component.html',
  styleUrls: ['./demo-range.component.scss'],
})
export class DemoRangeComponent {
  date: { from: string; to: string } = { from: '2018-01-01', to: '2018-01-05' };
  options: ICalendarComponentOptions = {
    from: new Date(2000, 0, 1),
    pickMode: 'range',
  };

  constructor(public modalCtrl: ModalController) { }

  onChange($event: any) {
    console.log($event);
  }

}
