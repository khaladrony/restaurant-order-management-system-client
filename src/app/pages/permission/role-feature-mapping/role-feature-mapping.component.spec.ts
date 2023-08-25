import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleFeatureMappingComponent } from './role-feature-mapping.component';

describe('RoleFeatureMappingComponent', () => {
  let component: RoleFeatureMappingComponent;
  let fixture: ComponentFixture<RoleFeatureMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleFeatureMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleFeatureMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
