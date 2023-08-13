import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerOrderLayoutComponent } from './customer-order-layout.component';

describe('CustomerOrderLayoutComponent', () => {
  let component: CustomerOrderLayoutComponent;
  let fixture: ComponentFixture<CustomerOrderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerOrderLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerOrderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
