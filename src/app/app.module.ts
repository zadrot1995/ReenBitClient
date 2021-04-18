import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import {RouterModule} from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { ChatPageComponent } from './chat-page/chat-page.component';
import {CreateChatPageComponent} from './create-chat-page/create-chat-page.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { EditMessageDialogComponent } from './edit-message-dialog/edit-message-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditChatPageComponent } from './edit-chat-page/edit-chat-page.component';

const routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'createChat', component: CreateChatPageComponent},
  { path: 'editChat/:id', component: EditChatPageComponent}

];

// @ts-ignore
// @ts-ignore
// @ts-ignore
// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    ChatPageComponent,
    CreateChatPageComponent,
    EditMessageDialogComponent,
    EditChatPageComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    MatSelectModule,
    ScrollingModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],

})
export class AppModule { }
