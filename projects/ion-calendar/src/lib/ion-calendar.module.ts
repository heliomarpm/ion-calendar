import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { IonCalendarService } from './ion-calendar.service';
import { CalendarModalController } from './calendar-modal.controller';
import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';
import { ION_CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent } from './components';
import { ICalendarModalOptions } from './models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export function calendarController(modalCtrl: ModalController, calSvc: IonCalendarService) {
  return new CalendarModalController(modalCtrl, calSvc);
}

@NgModule({
  declarations: [
    ION_CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    ION_CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent
  ],
  providers: [
    IonCalendarService,
    {
      provide: CalendarModalController,
      useFactory: calendarController,
      deps: [ModalController, IonCalendarService],
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IonCalendarModule {

  static forRoot(defaultOptions: ICalendarModalOptions = {}): ModuleWithProviders<any> {
    return {
      ngModule: IonCalendarModule,
      providers: [
        { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions }
      ]
    };
  }
}
