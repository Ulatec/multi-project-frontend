import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DailyDataService {

   apiUrl:string = environment.eurekaNamingServer + "CARVANA-TRACKER/api/dailyData/search/findByCountOfSoldNotOrderByDate?not=0"
  
  constructor(private httpClient: HttpClient) { }

  getDailyData(pageNumber: number, pageSize: number): Observable<getDailyData> {
  
    const searchUrl = `${this.apiUrl}`
    + `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<getDailyData>(searchUrl)
  }
  
}
interface getDailyData{
  _embedded: {
    dailyData: getDailyData[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
