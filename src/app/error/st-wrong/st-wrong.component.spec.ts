import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StWrongComponent } from './st-wrong.component';

describe('StWrongComponent', () => {
  let component: StWrongComponent;
  let fixture: ComponentFixture<StWrongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StWrongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
