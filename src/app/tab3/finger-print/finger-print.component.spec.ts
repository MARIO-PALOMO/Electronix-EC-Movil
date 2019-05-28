import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FingerPrintComponent } from './finger-print.component';

describe('FingerPrintComponent', () => {
  let component: FingerPrintComponent;
  let fixture: ComponentFixture<FingerPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerPrintComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FingerPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
