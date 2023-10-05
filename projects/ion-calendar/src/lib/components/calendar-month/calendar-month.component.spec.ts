import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonthComponent } from './calendar-month.component';

describe('CalendarMonthComponent', () => {
  let component: CalendarMonthComponent;
  let fixture: ComponentFixture<CalendarMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarMonthComponent]
    });
    fixture = TestBed.createComponent(CalendarMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
