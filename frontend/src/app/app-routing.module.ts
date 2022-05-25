import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditorComponent } from 'src/lib/router/editor/editor.component';
import { LoginComponent } from 'src/lib/router/login/login.component';
import { MainmenuComponent } from 'src/lib/router/mainmenu/mainmenu.component';
import { SurveyComponent } from 'src/lib/router/survey/survey.component';
import {SurveyResultComponent} from "../lib/router/surveyResult/surveyResult.component";

const myRoutes: Routes = [
  {path:'', redirectTo:'/login', pathMatch: 'full'},
  {path:'login',component: LoginComponent},
  {path:'main', component: MainmenuComponent},
  {path:'editor', component:EditorComponent},
  {path:'survey', component:SurveyComponent},
  {path:'result', component:SurveyResultComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(myRoutes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
