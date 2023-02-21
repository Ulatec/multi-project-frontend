import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Forecast } from '../common/forecast';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {


  apiUrl:string = environment.eurekaNamingServer + "CARVANA-TRACKER/api/quarterlyForecast"

  constructor(private httpClient: HttpClient) { }

  getForecast(): Observable<any> {
  
    const searchUrl = `${this.apiUrl}`;
    var test = this.httpClient.get(searchUrl, {responseType: "text"});
    return test;
  }
}

