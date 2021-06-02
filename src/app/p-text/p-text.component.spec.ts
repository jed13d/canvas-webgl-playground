import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PTextComponent } from './p-text.component';

describe('PTextComponent', () => {
  let component: PTextComponent;
  let fixture: ComponentFixture<PTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
