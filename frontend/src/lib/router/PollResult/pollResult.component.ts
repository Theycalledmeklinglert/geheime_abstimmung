import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexOptions} from "ng-apexcharts";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {EncryptedData} from "../../data-access/models/encryptedData";
import {Poll} from "../../data-access/models/Poll";
import {Answer} from "../../data-access/models/answer";
import {delay, lastValueFrom} from "rxjs";
import {error} from "@angular/compiler/src/util";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: ApexOptions[];
};

@Component({
  selector: 'surveyResult',
  templateUrl: './pollResult.component.html',
  styleUrls: ['./pollResult.component.css'],
})

export class PollResultComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private answers: Answer[][];
  tempPrivKey: string;
  enterCounter: number;
  validated: boolean = false;
  individual: boolean = false;
  questionCount;
  encryptedAnswers: EncryptedData[];
  showDecryptWindow: boolean = true;
  poll: Poll;

  constructor(private backendService: BackendService, private cryptService: EncryptionService, private authService: AuthenticationService) {
  }


  ngOnInit() {
    this.poll = JSON.parse(localStorage.getItem("clickedPoll"));
    localStorage.removeItem("clickedPoll");

    this.backendService.loadAnswers(this.poll._id).subscribe(result => {
      console.log(result);
      this.encryptedAnswers = result["answers"];
      this.authService.updateSessionid(result["Session ID"]);
      console.log(result["Session ID"])
    });


    this.enterCounter = 1;
    this.questionCount = 0;
  }


  showQuestionResult() {
    this.individual = false;
    if (this.poll.questions[this.questionCount].type == 'yesNoAnswer' || this.poll.questions[this.questionCount].type == 'fixedAnswer') {
      let values = this.getValues();
      let adjustedLabels =this.getAnswerTitles();
      for(let i = 0; i < adjustedLabels.length; i++){
        adjustedLabels[i] += ": "+values[i];
      }
      this.chartOptions = {
        series: values,
        chart: {
          type: "donut"
        },
        labels: adjustedLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 500
              },
              legend: {
                position: "bottom",
              }
            }
          }
        ]
      };
    } else {
      this.individual = true;
    }
  }


  async getDecryptedAnswers() {
    try {
      this.answers = this.encryptedAnswers.map(a => JSON.parse(this.cryptService.decrypt(this.tempPrivKey, a)));
      if (this.answers[0] != undefined) {
        this.validated = true;
        this.showDecryptWindow = false;
        this.showQuestionResult();
      }
    } catch (e) {
      console.log(e);
      this.enterCounter *= 2;
      this.showDecryptWindow = false;
      setTimeout(() => {
        this.showDecryptWindow = true;
      }, this.enterCounter * 1000);
    }
  }

  getValues(): number[] {
    let result: number[] = [];
    let localAnswers = this.getAnswersToThisQuestion();
    if (this.poll.questions[this.questionCount].type == 'yesNoAnswer') {
      let yes: number = 0;
      let no: number = 0;
      localAnswers.forEach(a => {
        (a.answer == true) ? yes++ : no++;
      });
      result.push(yes);
      result.push(no);
      return result;
    } else {
      this.getAnswerTitles().forEach(q => {
        let counter: number = 0;
        localAnswers.forEach(a => {
          if (a.answer == q) counter++
        });
        result.push(counter);
      });
      return result;
    }
  }

  private getAnswersToThisQuestion() {
    let localAnswers: Answer[] = [];
    for (const answerArray of this.answers) {
      localAnswers.push(answerArray.find(a => a.id == this.poll.questions[this.questionCount].id));
    }
    return localAnswers;
  }

  getAnswerTitles() {
    if (this.poll.questions[this.questionCount].type == 'yesNoAnswer') return ["Yes", "No"];
    else return this.poll.questions[this.questionCount].fixedAnswers
    //   .sort((n1,n2) => {
    //   if (n1 > n2) {
    //     return 1;
    //   }
    //
    //   if (n1 < n2) {
    //     return -1;
    //   }
    //
    //   return 0;
    // });
  }

  getIndividualAnswers(): string[] {
    let localAnswers = this.getAnswersToThisQuestion();
    let result: string[] = [];
    localAnswers.forEach(a => {
      if (typeof a.answer === "string") {
        result.push(a.answer)
      }
    });
    return result;
  }

  print(): void {
    const printContent = document.getElementById("forPrint");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}

