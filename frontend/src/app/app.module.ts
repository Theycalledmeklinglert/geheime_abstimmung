import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import {ClipboardModule} from "@angular/cdk/clipboard";
import { MaterialModule } from './material.module';
//Custom-Components
import {QuestionComponent} from "../lib/question/question.component";
import {MainmenuComponent} from "../lib/router/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/router/login/login.component";
import { SurveyComponent } from '../lib/router/survey/survey.component';
import {EditorComponent} from "../lib/router/editor/editor.component";
import {PollComponent} from "../lib/polllistmodule/poll/Poll.component";
import {PollConainterComponent} from "../lib/polllistmodule/pollcontainer/PollContainer.component";
import { SurveyQuestionComponent } from 'src/lib/survey-question/survey-question.component';
import {UserComponent} from "../lib/userlistmodule/user/User.component";
import {UserConainterComponent} from "../lib/userlistmodule/usercontainer/UserContainer.component";
import {PollResultComponent} from "../lib/router/PollResult/pollResult.component";


@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainmenuComponent,
    EditorComponent,
    LoginComponent,
    SurveyComponent,
    SurveyQuestionComponent,
    PollComponent,
    PollConainterComponent,
    PollResultComponent,
    UserComponent,
    UserConainterComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ClipboardModule,
        HttpClientModule,
        MaterialModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
