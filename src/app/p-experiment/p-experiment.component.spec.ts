import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PExperimentComponent } from './p-experiment.component';

describe('PExperimentComponent', () => {
  let component: PExperimentComponent;
  let fixture: ComponentFixture<PExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PExperimentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
