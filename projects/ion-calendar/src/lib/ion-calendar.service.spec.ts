import { TestBed } from '@angular/core/testing';

import { IonCalendarService } from './ion-calendar.service';

describe('IonCalendarService', () => {
  let service: IonCalendarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonCalendarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
