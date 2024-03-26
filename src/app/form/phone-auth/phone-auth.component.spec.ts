import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneAuthComponent } from './phone-auth.component';

describe('PhoneAuthComponent', () => {
  let component: PhoneAuthComponent;
  let fixture: ComponentFixture<PhoneAuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneAuthComponent]
    });
    fixture = TestBed.createComponent(PhoneAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
