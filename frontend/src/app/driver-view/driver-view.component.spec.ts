import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverViewComponent } from './driver-view.component';

describe('DriverViewComponent', () => {
  let component: DriverViewComponent;
  let fixture: ComponentFixture<DriverViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
