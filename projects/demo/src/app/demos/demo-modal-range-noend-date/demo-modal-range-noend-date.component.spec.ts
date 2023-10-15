import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalRangeNoEndDateComponent } from './demo-modal-range-noend-date.component';

describe('DemoModalRangeEndDateComponent', () => {
  let component: DemoModalRangeNoEndDateComponent;
  let fixture: ComponentFixture<DemoModalRangeNoEndDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalRangeNoEndDateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalRangeNoEndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
