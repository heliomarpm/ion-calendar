import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalRangeEndDateComponent } from './demo-modal-range-end-date.component';

describe('DemoModalRangeEndDateComponent', () => {
  let component: DemoModalRangeEndDateComponent;
  let fixture: ComponentFixture<DemoModalRangeEndDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalRangeEndDateComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalRangeEndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
