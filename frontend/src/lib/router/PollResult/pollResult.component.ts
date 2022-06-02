import {Component, ViewChild} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChartComponent, ApexNonAxisChartSeries, ApexResponsive, ApexChart, ApexOptions} from "ng-apexcharts";

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

export class PollResultComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;


  constructor() {
    this.chartOptions = {
      series: [50, 50],
      chart: {
        type: "donut"
      },
      labels: ["Yes", "No"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
}


  getIDofclickedPoll():string{
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

