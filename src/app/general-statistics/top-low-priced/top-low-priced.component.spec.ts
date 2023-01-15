import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLowPricedComponent } from './top-low-priced.component';

describe('TopLowPricedComponent', () => {
  let component: TopLowPricedComponent;
  let fixture: ComponentFixture<TopLowPricedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopLowPricedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopLowPricedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
