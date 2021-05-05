import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PRainComponent } from './p-rain.component';

describe('PRainComponent', () => {
  let component: PRainComponent;
  let fixture: ComponentFixture<PRainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PRainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PRainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
