import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBootstrapConfirmationModalComponent } from './ngx-bootstrap-confirmation-modal.component';

describe('NgBootstrapConfirmationModalComponent', () => {
  let component: NgBootstrapConfirmationModalComponent;
  let fixture: ComponentFixture<NgBootstrapConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgBootstrapConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBootstrapConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
