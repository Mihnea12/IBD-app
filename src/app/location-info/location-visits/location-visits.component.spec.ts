import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationVisitsComponent } from './location-visits.component';

describe('LocationVisitsComponent', () => {
  let component: LocationVisitsComponent;
  let fixture: ComponentFixture<LocationVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationVisitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
