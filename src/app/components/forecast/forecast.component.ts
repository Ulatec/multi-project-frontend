import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ForecastService } from 'src/app/services/forecast.service';
import { CommonModule } from '@angular/common';  
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {
  quarterlySalesForecast!: number;
  quarterlyRevenueForecast!: number;
  
  
  constructor(private forecastService: ForecastService, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.updateData();
  }
  updateData(){
    this.forecastService.getForecast().subscribe(
      data => {
        this.processResult()
      }
    );
  }
  processResult() {
    return (data: any) => {
      this.quarterlySalesForecast = data.sales;
      this.quarterlyRevenueForecast = data.dollars;
    }
  }
}
