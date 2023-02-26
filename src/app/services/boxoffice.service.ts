import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoxofficeService {
  //apiUrl:string = environment.eurekaNamingServer + "BOX-OFFICE-TRACKER/"
  apiUrl:string =  "http://localhost:7777/"
  constructor(private httpClient: HttpClient) { }

  getDailyDataVersusYear(year: Number): Observable<getDailyBoxOffice> {
  
    const searchUrl = `${this.apiUrl}` + "getCurrentYearOnYearDifference/" + year;
    return this.httpClient.get<getDailyBoxOffice>(searchUrl)
  }
  getTopMovies(pageNumber: number, pageSize: number): Observable<getMovies> {
  
    const searchUrl = `${this.apiUrl}` + `movies/search/findAllByTotalEstimatedRevenueGreaterThanOrderByTotalEstimatedRevenueDesc?totalEstimatedRevenue=0`
    + `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<getMovies>(searchUrl)
  }
}
interface getDailyBoxOffice{
  dailyBar: getDailyBoxOffice[];
}
interface getMovies{
  _embedded: {
    movie: getMovies[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}