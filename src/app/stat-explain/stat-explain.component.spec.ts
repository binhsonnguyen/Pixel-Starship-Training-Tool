import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatExplainComponent } from './stat-explain.component';

describe('StatExplainComponent', () => {
  let component: StatExplainComponent;
  let fixture: ComponentFixture<StatExplainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatExplainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatExplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
