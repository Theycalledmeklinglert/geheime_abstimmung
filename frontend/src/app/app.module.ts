import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {QuestionComponent} from "../lib/question/question.component";
import {RouterModule, Routes} from "@angular/router";
import {MainmenuComponent} from "../lib/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/login/login.component";


const myRoutes: Routes = [
  {path:'main', component: MainmenuComponent},
  {path:'login',component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainmenuComponent
  ],
  imports: [
    RouterModule.forRoot(myRoutes),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
