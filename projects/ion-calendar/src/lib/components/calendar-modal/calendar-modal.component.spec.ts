import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarModalComponent } from './calendar-modal.component';

describe('CalendarModalComponent', () => {
  let component: CalendarModalComponent;
  let fixture: ComponentFixture<CalendarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarModalComponent]
    });
    fixture = TestBed.createComponent(CalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
