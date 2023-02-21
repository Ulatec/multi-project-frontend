import { Component, OnInit } from '@angular/core';
import { DailyDataPoint } from 'src/app/common/daily-data-point';
import { DailyDataService } from 'src/app/services/daily-data.service';

@Component({
  selector: 'app-daily-data',
  templateUrl: './daily-data.component.html',
  styleUrls: ['./daily-data.component.css']
})
export class DailyDataComponent implements OnInit {

  dailyData: DailyDataPoint[] = [];
  private pageNumber: number = 0;
  private pageSize: number = 365;
  private totalElements!: number;

  constructor(private dailyDataService: DailyDataService) { }

  ngOnInit(): void {
    this.updateData();
    setInterval(() => {
      this.updateData();
    }, 30000);
    
    
  }

  updateData(){
    this.dailyDataService.getDailyData(this.pageNumber - 1, this.pageSize).subscribe(
      this.processResult()
    );
  }
  processResult() {
    return (data: any) => {
      this.dailyData = data._embedded.dailyData;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }
}
