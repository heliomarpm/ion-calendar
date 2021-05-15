import { InjectionToken } from '@angular/core';
import { CalendarModalOptions } from './calendar.models';

export const DEFAULT_CALENDAR_OPTIONS = new InjectionToken<CalendarModalOptions>('DEFAULT_CALENDAR_MODAL_OPTIONS');
