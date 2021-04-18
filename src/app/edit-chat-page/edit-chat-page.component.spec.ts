import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChatPageComponent } from './edit-chat-page.component';

describe('EditChatPageComponent', () => {
  let component: EditChatPageComponent;
  let fixture: ComponentFixture<EditChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChatPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
