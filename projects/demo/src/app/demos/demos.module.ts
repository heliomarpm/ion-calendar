import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { IonCalendarModule } from '@heliomarpm/ion-calendar';

import { DemoBasicComponent } from './demo-basic/demo-basic.component';
import { DemoEventsComponent } from './demo-events/demo-events.component';
import { DemoMethodsComponent } from './demo-methods/demo-methods.component';
// import { DemoModalBasicComponent } from './demo-modal-basic/demo-modal-basic.component';
// import { DemoModalConfigDaysComponent } from './demo-modal-config-days/demo-modal-config-days.component';
// import { DemoModalCustomStyleComponent } from './demo-modal-custom-style/demo-modal-custom-style.component';
// import { DemoModalDefaultScrollComponent } from './demo-modal-default-scroll/demo-modal-default-scroll.component';
// import { DemoModalDisableWeekComponent } from './demo-modal-disable-week/demo-modal-disable-week.component';
// import { DemoModalLocaleComponent } from './demo-modal-locale/demo-modal-locale.component';
// import { DemoModalMultiComponent } from './demo-modal-multi/demo-modal-multi.component';
// import { DemoModalRangeComponent } from './demo-modal-range/demo-modal-range.component';
// import { DemoModalRangeBackwardsComponent } from './demo-modal-range-backwards/demo-modal-range-backwards.component';
// import { DemoModalRangeEndDateComponent } from './demo-modal-range-end-date/demo-modal-range-end-date.component';
// import { DemoModalCustomSubHeaderComponent } from './demo-modal-custom-sub-header/demo-modal-custom-sub-header.component';
// import { DemoMultiComponent } from './demo-multi/demo-multi.component';
import { DemoOptionsComponent } from './demo-options/demo-options.component';
// import { DemoRangeComponent } from './demo-range/demo-range.component';

const COMPONENTS = [
  DemoBasicComponent,
  DemoEventsComponent,
  DemoMethodsComponent,
  // DemoModalBasicComponent,
  // DemoModalConfigDaysComponent,
  // DemoModalCustomStyleComponent,
  // DemoModalCustomSubHeaderComponent,
  // // SubHeaderCalendarModal,
  // DemoModalDefaultScrollComponent,
  // DemoModalDisableWeekComponent,
  // DemoModalLocaleComponent,
  // DemoModalMultiComponent,
  // DemoModalRangeComponent,
  // DemoModalRangeBackwardsComponent,
  // DemoModalRangeEndDateComponent,
  // DemoMultiComponent,
  DemoOptionsComponent,
  // DemoRangeComponent,
];


@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, FormsModule, IonicModule, IonCalendarModule],
  exports: [...COMPONENTS],
})
export class DemosModule {}
