import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DailyDataPoint } from 'src/app/common/daily-data-point';
import { DailyDataService } from 'src/app/services/daily-data.service';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { DatePipe } from '@angular/common';
import { enUS } from 'date-fns/locale';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { UserSettingRequest } from 'src/app/common/user-setting-request';
import { Setting } from 'src/app/common/setting';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  isAuthenticated: boolean = false;
  chartOptions!: any;
  dailyData: DailyDataPoint[] = [];
  daysAverageToCalculate: number = 7;
  private pageNumber: number = 0;
  private pageSize: number = 365;
  private newLabel? = 'New label';
  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,private dailyDataService: DailyDataService, private datePipe: DatePipe, private settingsService: SettingsService) {
    Chart.register(Annotation)

  }

  ngOnInit(): void {
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        if(this.isAuthenticated){
          this.retrieveUserSetting("boxOfficeYear")
        }else{
          this.updateData()
        }
        console.log(this.isAuthenticated)
      }
    )
  }

  buildChartOptions(daysToAverage: number) {
    this.clearExistingChartData();
    for (let i = 0; i < this.dailyData.length; i++) {
      let salesTotal = 0;
      let newListingsTotal = 0;
      let salesDollarsTotal = 0;
      //check if daysToAverage days of data available
      if (i + daysToAverage < this.dailyData.length) {
        for (let j = i; j < i + daysToAverage; j++) {
          salesTotal += this.dailyData[j].countOfSold
          newListingsTotal += this.dailyData[j].countOfNewListings;
          salesDollarsTotal += this.dailyData[j].countOfSalesDollars;
        }

        this.lineChartData.labels?.unshift(this.datePipe.transform(this.dailyData[i].date, 'yyyy/MM/dd'));
        this.lineChartData.datasets[0].data.unshift(salesTotal);
        this.lineChartData.datasets[1].data.unshift(newListingsTotal)
        this.lineChartData.datasets[2].data.unshift(salesDollarsTotal)
      }
    }
    this.chart?.update();
  }
  setDaysAverage(value: any){
    if(typeof value === "string"){
      this.daysAverageToCalculate = Number.parseInt(value)
    }else{
      this.daysAverageToCalculate = value;
    }
    this.updateData();
  }
  updateData() {
    this.dailyDataService.getDailyData(this.pageNumber - 1, this.pageSize).subscribe(
      this.processResult()
    );
    if(this.isAuthenticated){
      this.updateUserSetting("carvanaDaysAverage", this.daysAverageToCalculate);
    }
  }
  processResult() {
    return (data: any) => {
      this.dailyData = data._embedded.dailyData;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.buildChartOptions(this.daysAverageToCalculate);
    }
  }
  //REFACTOR
  retrieveUserSetting(key: string){
    this.oktaAuth.getUser().then(
      (res: any) =>{
        let userSettingRequest = new UserSettingRequest();
        userSettingRequest.email = res.email;
        userSettingRequest.setting = new Setting(key, null);
        this.settingsService.getSetting(userSettingRequest).subscribe(
          (data) => {
            console.log(Number.parseInt(data.value))
            this.daysAverageToCalculate = Number.parseInt(data.value)
            this.setDaysAverage(this.daysAverageToCalculate)
          }
        );
      }
    )
  }
  //REFACTOR
  updateUserSetting(key: String, value: any){
    this.oktaAuth.getUser().then(
      (res: any) =>{
        let userSettingRequest = new UserSettingRequest();
        userSettingRequest.email = res.email;
        userSettingRequest.setting = new Setting(key, value);
        this.settingsService.setSetting(userSettingRequest).subscribe();
      }
    )
  
  }
  clearExistingChartData(){
    this.lineChartData.datasets[0].data = [];
    this.lineChartData.datasets[1].data = [];
    this.lineChartData.datasets[2].data = [];
    this.lineChartData.labels = [];
  }


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ ],
        label: 'Sales',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'New Listings',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Sales Dollars',
        yAxisID: 'y1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y:
        {
          position: 'left',
        },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      },
      x:
        {
          ticks: {
            color: 'rgba(245,248,249,255)'
          },
        },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
        ],
      }
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.datasets.forEach((x, i) => {
      const num = ChartComponent.generateNumber(i);
      x.data.push(num);
    });
    this.lineChartData?.labels?.push(`Label ${ this.lineChartData.labels.length }`);

    this.chart?.update();
  }

  public changeColor(): void {
    this.lineChartData.datasets[2].borderColor = 'green';
    this.lineChartData.datasets[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;

    this.chart?.update();
  }

  public changeLabel(): void {
    const tmp = this.newLabel;
    this.newLabel = this.lineChartData.datasets[2].label;
    this.lineChartData.datasets[2].label = tmp;
    this.chart?.update();
  }
}

