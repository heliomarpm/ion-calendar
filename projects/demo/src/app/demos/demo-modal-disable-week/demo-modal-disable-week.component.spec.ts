import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalDisableWeekComponent } from './demo-modal-disable-week.component';

describe('DemoModalDisableWeekComponent', () => {
  let component: DemoModalDisableWeekComponent;
  let fixture: ComponentFixture<DemoModalDisableWeekComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalDisableWeekComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalDisableWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
