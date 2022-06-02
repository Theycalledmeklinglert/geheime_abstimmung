import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import {NgApexchartsModule} from "ng-apexcharts";
//Custom-Components
import {QuestionComponent} from "../lib/question/question.component";
import {MainmenuComponent} from "../lib/router/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/router/login/login.component";
import { SurveyComponent } from '../lib/router/survey/survey.component';
import {EditorComponent} from "../lib/router/editor/editor.component";
import {PollComponent} from "../lib/polllistmodule/poll/Poll.component";
import {VoteConainterComponent} from "../lib/polllistmodule/pollcontainer/PollContainer.component";
import { SurveyQuestionComponent } from 'src/lib/survey-question/survey-question.component';

//Angular-Material-Compontents
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatButtonModule} from '@angular/material/button'
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {PollResultComponent} from "../lib/router/PollResult/pollResult.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatDialogModule} from '@angular/material/dialog';



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
    VoteConainterComponent,
    PollResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDatepickerModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    NgApexchartsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
