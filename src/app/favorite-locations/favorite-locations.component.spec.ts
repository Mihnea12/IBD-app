import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteLocationsComponent } from './favorite-locations.component';

describe('FavoritesLocationsComponent', () => {
  let component: FavoriteLocationsComponent;
  let fixture: ComponentFixture<FavoriteLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteLocationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
