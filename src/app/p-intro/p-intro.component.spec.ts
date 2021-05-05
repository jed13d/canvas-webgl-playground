import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PIntroComponent } from './p-intro.component';

describe('PIntroComponent', () => {
  let component: PIntroComponent;
  let fixture: ComponentFixture<PIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
