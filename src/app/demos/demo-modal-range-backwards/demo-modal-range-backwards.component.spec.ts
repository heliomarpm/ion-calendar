import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalRangeBackwardsComponent } from './demo-modal-range-backwards.component';

describe('DemoModalRangeBackwardsComponent', () => {
  let component: DemoModalRangeBackwardsComponent;
  let fixture: ComponentFixture<DemoModalRangeBackwardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalRangeBackwardsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalRangeBackwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
