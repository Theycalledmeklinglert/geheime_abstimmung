import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatButtonModule} from '@angular/material/button'

import {QuestionComponent} from "../lib/question/question.component";
import {RouterModule, Routes} from "@angular/router";
import {MainmenuComponent} from "../lib/router/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/router/login/login.component";
import { SurveyComponent } from '../lib/router/survey/survey.component';
import {EditorComponent} from "../lib/router/editor/editor.component";
import {VoteComponent} from "../lib/voteListModule/vote/vote.component";
import {VoteConainterComponent} from "../lib/voteListModule/votecontainer/voteContainer.component";
import { SurveyQuestionComponent } from 'src/lib/survey-question/survey-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainmenuComponent,
    EditorComponent,
    LoginComponent,
    SurveyComponent,
    SurveyQuestionComponent,
    VoteComponent,
    VoteConainterComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
