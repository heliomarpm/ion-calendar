import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalDefaultScrollComponent } from './demo-modal-default-scroll.component';

describe('DemoModalDefaultScrollComponent', () => {
  let component: DemoModalDefaultScrollComponent;
  let fixture: ComponentFixture<DemoModalDefaultScrollComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalDefaultScrollComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalDefaultScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
