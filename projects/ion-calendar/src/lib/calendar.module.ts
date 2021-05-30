import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

import { CALENDAR_COMPONENTS } from './calendar.components';
import { MonthPickerComponent } from './components/month-picker.component';
import { YearPickerComponent } from './components/year-picker.component';
import { CalendarService } from './calendar.service';
import { CalendarModalController } from './calendar-modal.controller';
import { CalendarModalOptions } from './calendar.models';
import { DEFAULT_CALENDAR_OPTIONS } from './calendar-options.provider';

export function calendarController(modalCtrl: ModalController, calSvc: CalendarService) {
  return new CalendarModalController(modalCtrl, calSvc);
}

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule],
  declarations: [CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent],
  exports: [CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent],
  entryComponents: [CALENDAR_COMPONENTS, MonthPickerComponent, YearPickerComponent],
  providers: [
    CalendarService,
    {
      provide: CalendarModalController,
      useFactory: calendarController,
      deps: [ModalController, CalendarService],
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IonCalendarModule {
  static forRoot(defaultOptions: CalendarModalOptions = {}): ModuleWithProviders<any> {
    return {
      ngModule: IonCalendarModule,
      providers: [
        { provide: DEFAULT_CALENDAR_OPTIONS, useValue: defaultOptions }
      ]
    };
  }
}