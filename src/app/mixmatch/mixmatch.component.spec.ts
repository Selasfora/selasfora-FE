import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MixmatchComponent } from './mixmatch.component';

describe('MixmatchComponent', () => {
  let component: MixmatchComponent;
  let fixture: ComponentFixture<MixmatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixmatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
