import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineComponentComponent } from './timeline-component.component';

describe('TimelineComponentComponent', () => {
  let component: TimelineComponentComponent;
  let fixture: ComponentFixture<TimelineComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
