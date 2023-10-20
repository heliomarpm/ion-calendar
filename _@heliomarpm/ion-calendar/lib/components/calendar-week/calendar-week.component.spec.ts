import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarWeekComponent } from './calendar-week.component';

describe('CalendarWeekComponent', () => {
  let component: CalendarWeekComponent;
  let fixture: ComponentFixture<CalendarWeekComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarWeekComponent]
    });
    fixture = TestBed.createComponent(CalendarWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
