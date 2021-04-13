import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChatPageComponent } from './create-chat-page.component';

describe('CreateChatPageComponent', () => {
  let component: CreateChatPageComponent;
  let fixture: ComponentFixture<CreateChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateChatPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
