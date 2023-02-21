import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType, scales } from 'chart.js';
import Annotation from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts';
import { BoxOfficeDaily } from 'src/app/common/box-office-daily';
import { BoxofficeService } from 'src/app/services/boxoffice.service';

@Component({
  selector: 'app-boxoffice-charts',
  templateUrl: './boxoffice-charts.component.html',
  styleUrls: ['./boxoffice-charts.component.css']
})
export class BoxofficeChartsComponent implements OnInit {
  comparisonYear: Number = 2022;
  newLabel: string | undefined;
  dailyData: BoxOfficeDaily[] = [];
  chartOptions!: any;
  today: Date = new Date();
  constructor(private boxOfficeServer: BoxofficeService, private datePipe: DatePipe) {
    Chart.register(Annotation)

  }

  ngOnInit(): void {
    this.updateData(2022);
  }
  buildChartOptions() {
    this.clearExistingChartData();
    for (let i = 0; i < this.dailyData.length; i++) {
      let date = new Date(Date.parse(this.dailyData[i].date.toString()));
      if(date.getFullYear() === this.today.getFullYear()){
      
        this.lineChartData.labels?.unshift(this.datePipe.transform(date, 'yyyy/MM/dd'));
        this.lineChartData.datasets[0].data.unshift(this.dailyData[i].currentYearDollars);
        this.lineChartData.datasets[1].data.unshift(this.dailyData[i].pastYearDollars)
        this.lineChartData.datasets[2].data.unshift(this.dailyData[i].percenageDifference)
      }
    
    }
    this.chart?.update();
  }
  updateData(year: number) {
    this.boxOfficeServer.getDailyDataVersusYear(year).subscribe(
      this.processResult()
    );
  }
  clearExistingChartData(){
    this.lineChartData.datasets[0].data = [];
    this.lineChartData.datasets[1].data = [];
    this.lineChartData.datasets[2].data = [];
    this.lineChartData.labels = [];
  }
  setComparisonYear(year: any){
    this.updateData(Number.parseInt(year));
  }
  processResult() {
    return (data: any) => {
      this.dailyData = data;
      this.buildChartOptions();
    }
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [ ],
        label: 'Current Year To Date Revenue',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        fill: 'none',
      },
      {
        data: [],
        label: 'Comparison Year Revenue',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        fill: 'none',
      },
      {
        data: [],
        label: 'Percentage Delta',
        yAxisID: 'y1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        fill: 'origin',
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      },
      point:{
        radius: 0
      }
    },
    scales: {
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
      legend: { display: true,
        labels: { color:  'rgba(245,248,249,255)'},
      },
      annotation: {
        annotations: [
        ],
      },
      
    }
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // events

  public hideOne(): void {
    const isHidden = this.chart?.isDatasetHidden(1);
    this.chart?.hideDataset(1, !isHidden);
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
