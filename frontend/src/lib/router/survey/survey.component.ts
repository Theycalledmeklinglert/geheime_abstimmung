import { Component, OnInit } from '@angular/core';
import { Question } from 'src/lib/data-access/question';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  questions:Question[];

  constructor() { }

  ngOnInit(): void {
    this.questions = []; //Platzhalter zum testen bis Backendanbindung funktioniert
  }

}
