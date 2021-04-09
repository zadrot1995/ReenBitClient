import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import {RouterModule} from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';

const routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent}


];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterPageComponent,
    LoginPageComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
