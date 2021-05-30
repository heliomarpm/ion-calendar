/* eslint-disable @angular-eslint/component-selector */
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponentOptions } from 'projects/ion-calendar/src/lib';


@Component({
  selector: 'demo-basic',
  template: `
    <hr>
    <h3 style="text-align: center;">basic</h3>
    <ion-calendar [(ngModel)]="date"
                  (onChange)="onChange($event)"
                  [options]="options"
                  type="string"
                  format="YYYY-MM-DD">
    </ion-calendar>

    SeletedDate: {{ date }}
  `,
})
export class DemoBasicComponent {
  date = '1970-01-01';
  options: CalendarComponentOptions = {
    from: new Date(1950, 0, 1),
    showYearPicker: true,
  };

  constructor(public modalCtrl: ModalController) {}

  onChange($event: any) {
    console.log($event);
  }
}
