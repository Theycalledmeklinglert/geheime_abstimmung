import {Component, OnInit, ViewChild} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexOptions} from "ng-apexcharts";
import {EncryptionService} from "../../data-access/service/encryption.service";
import {EncryptedData} from "../../data-access/models/encryptedData";

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

export class PollResultComponent implements OnInit{
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  private answers: string[];
  private values: number[];
  validated: boolean;
  tempPrivKey: string;
  enterCounter: number;
  encryptedAnswers: EncryptedData[];

  constructor(private backendService: BackendService, private cryptService: EncryptionService) {}


  ngOnInit(): void {
    // this.encryptedAnswers = this.backendService.getAnswers();
    this.enterCounter = 5;
  }



  showChart(){

    // this.answers = this.encryptedAnswers.map( a => this.cryptService.decrypt(this.tempPrivKey, a));

    if(this.enterCounter == 0) this.encryptedAnswers = undefined;

    if(this.tempPrivKey == 'Swordfish') {
      this.answers = ["Ja lass saufen", "Ne muss morgen Programmierprojekt präsentieren", "Ein Bier geht"];
      this.values = [69.420, 10.13, 20.87];
      this.validated = true;
      this.chartOptions = {
        series: this.values,
        chart: {
          type: "donut"
        },
        labels: this.answers,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 400
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    } else{
      this.enterCounter--;
    }
  }



  getIDofClickedPoll():string{
    return localStorage.getItem("clickedPoll");
  }



  print():void{
    const printContent = document.getElementById("forPrint");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}

