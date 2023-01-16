import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopVisitedComponent } from './top-visited.component';

describe('TopVisitedComponent', () => {
  let component: TopVisitedComponent;
  let fixture: ComponentFixture<TopVisitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopVisitedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopVisitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
