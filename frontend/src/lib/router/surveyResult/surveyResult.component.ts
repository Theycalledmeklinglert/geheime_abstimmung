import { Component} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {MatPaginatorModule} from '@angular/material/paginator';


@Component({
  selector: 'surveyResult',
  templateUrl: './surveyResult.component.html',
  styleUrls: ['./surveyResult.component.css'],
})

export class SurveyResultComponent{}
