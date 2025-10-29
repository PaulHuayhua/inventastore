import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyList } from './buy-list';

describe('BuyList', () => {
  let component: BuyList;
  let fixture: ComponentFixture<BuyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
