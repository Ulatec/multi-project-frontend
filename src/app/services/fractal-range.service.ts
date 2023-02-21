import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FractalRangeService {
  apiUrl:string = environment.eurekaNamingServer + "/FRACTAL-RANGE-CALCULATOR/getFractalHistory/"

  
  constructor(private httpClient: HttpClient) { 
    
  }

  getDailyData(ticker: String): Observable<getDailyBar> {
  
    const dataUrl = `${this.apiUrl}` + ticker;
    var test = this.httpClient.get(dataUrl, {responseType: "text"})
    return this.httpClient.get<getDailyBar>(dataUrl)
  }
}
interface getDailyBar{
  dailyBar: getDailyBar[];
}
