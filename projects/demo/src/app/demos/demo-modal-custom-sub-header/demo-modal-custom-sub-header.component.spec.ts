import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DemoModalCustomSubHeaderComponent } from './demo-modal-custom-sub-header.component';

describe('DemoModalCustomSubHeaderComponent', () => {
  let component: DemoModalCustomSubHeaderComponent;
  let fixture: ComponentFixture<DemoModalCustomSubHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoModalCustomSubHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoModalCustomSubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
