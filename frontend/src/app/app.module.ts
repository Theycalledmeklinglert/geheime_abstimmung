import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {QuestionComponent} from "../lib/question/question.component";
import {RouterModule, Routes} from "@angular/router";
import {MainmenuComponent} from "../lib/router/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/router/login/login.component";
import { SurveyComponent } from '../lib/router/survey/survey.component';
import {EditorComponent} from "../lib/router/editor/editor.component";
import {VoteComponent} from "../lib/voteListModule/vote/vote.component";
import {VoteConainterComponent} from "../lib/voteListModule/votecontainer/voteContainer.component";
import { FormsModule } from '@angular/forms';

const myRoutes: Routes = [
  {path:'main', component: MainmenuComponent},
  {path:'login',component: LoginComponent},
  {path:'editor', component:EditorComponent},
  {path:'survey', component:SurveyComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainmenuComponent,
    EditorComponent,
    LoginComponent,
    SurveyComponent,
    VoteComponent,
    VoteConainterComponent
  ],
  imports: [
    RouterModule.forRoot(myRoutes),
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
