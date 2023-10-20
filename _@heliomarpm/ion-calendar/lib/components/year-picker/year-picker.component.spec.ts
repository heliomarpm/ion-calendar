import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearPickerComponent } from './year-picker.component';

describe('YearPickerComponent', () => {
  let component: YearPickerComponent;
  let fixture: ComponentFixture<YearPickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearPickerComponent]
    });
    fixture = TestBed.createComponent(YearPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
