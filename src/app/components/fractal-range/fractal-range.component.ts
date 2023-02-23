import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DailyDataPoint } from 'src/app/common/daily-data-point';
import { DailyDataService } from 'src/app/services/daily-data.service';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { DatePipe } from '@angular/common';
import { enUS } from 'date-fns/locale';
import { DailyBar } from 'src/app/common/daily-bar';
import { FractalRangeService } from 'src/app/services/fractal-range.service';

@Component({
  selector: 'app-fractal-range',
  templateUrl: './fractal-range.component.html',
  styleUrls: ['./fractal-range.component.css']
})
export class FractalRangeComponent implements OnInit {
  chartOptions!: any;
  dailyData: DailyBar[] = [];
  private newLabel? = 'New label';
  constructor(private fractalRangeService: FractalRangeService, private datePipe: DatePipe) {
    Chart.register(Annotation)

  }

  ngOnInit(): void {
    this.sendRequest("XLU");
  }

  buildChartOptions() {
    this.clearExistingChartData();
    for (let i = 0; i < this.dailyData.length/2; i++) {
        this.lineChartData.labels?.unshift(this.datePipe.transform(new Date(Date.parse(this.dailyData[i].date.toString())), 'yyyy/MM/dd'));
        this.lineChartData.datasets[0].data.unshift(this.dailyData[i].close);
        this.lineChartData.datasets[1].data.unshift(this.dailyData[i].bb_top)
        this.lineChartData.datasets[2].data.unshift(this.dailyData[i].bb_bottom)
        this.lineChartData.datasets[3].data.unshift(this.dailyData[i].trend)
    }
    this.chart?.update();
  }

  sendRequest(ticker: string) {
    this.clearExistingChartData();
    this.fractalRangeService.getDailyData(ticker).subscribe(
      this.processResult()
    
    );
  }
  processResult() {
    return (data: any) => {
      this.dailyData = data;
      this.buildChartOptions();
    }
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
        label: 'Close',
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
        label: 'Top of Range',
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
        label: 'Bottom of Range',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [],
        label: 'Trend',
        backgroundColor: 'rgba(27, 168, 68, 0.8)',
        borderColor: 'rgba(27, 168, 68, 0.8)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'none',
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
      // We use this empty structure as a placeholder for dynamic theming.
      y:
        {
          position: 'left',
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
      }
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


