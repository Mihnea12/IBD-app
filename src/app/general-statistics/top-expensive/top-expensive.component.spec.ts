import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopExpensiveComponent } from './top-expensive.component';

describe('TopExpensiveComponent', () => {
  let component: TopExpensiveComponent;
  let fixture: ComponentFixture<TopExpensiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopExpensiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopExpensiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
