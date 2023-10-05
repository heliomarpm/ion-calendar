/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';

// @Component({
//   template: `
//   <ion-calendar-modal #calendar>
//     <div sub-header [style.backgroundColor]="'white'">
//       <label>Date seleted: </label>
//       <span *ngFor="let d of calendar.datesTemp; let i = index">
//         <ion-button *ngIf="d" [color]="calendar._d.color!" (click)="toDate(d.time)">{{d.time}}</ion-button>
//       </span>
//     </div>
//   </ion-calendar-modal>
//   `
// })

@Component({
  selector: 'app-sub-header-calendar-modal',
  templateUrl: './sub-header-calendar-modal.html',
})
export class SubHeaderCalendarModal {
  toDate(p: any) {
    console.log(p);
  }
}
