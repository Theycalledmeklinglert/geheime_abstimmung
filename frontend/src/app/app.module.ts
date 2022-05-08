import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {QuestionComponent} from "../lib/question/question.component";
import {RouterModule, Routes} from "@angular/router";
import {MainmenuComponent} from "../lib/mainmenu/mainmenu.component";
import {LoginComponent} from "../lib/login/login.component";
import {EditorComponent} from "../lib/editor/editor.component";
import {VoteComponent} from "../lib/voteListModule/vote/vote.component";
import {VoteConainterComponent} from "../lib/voteListModule/votecontainer/voteContainer.component";


const myRoutes: Routes = [
  {path:'main', component: MainmenuComponent},
  {path:'login',component: LoginComponent},
  {path:'editor', component:EditorComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    MainmenuComponent,
    EditorComponent,
    LoginComponent,
    VoteComponent,
    VoteConainterComponent
  ],
  imports: [
    RouterModule.forRoot(myRoutes),
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
