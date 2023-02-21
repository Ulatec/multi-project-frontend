import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  apiUrl:string = environment.eurekaNamingServer +"CARVANA-TRACKER/api/vinentry/search/findAllSoldFalseAndOrderByWriteDown?"
  
  constructor(private httpClient: HttpClient) { }

  getVehicles(pageNumber: number, pageSize: number): Observable<getVehicles> {
  
    const searchUrl = `${this.apiUrl}`
    + `&page=${pageNumber}&size=${pageSize}`;
    return this.httpClient.get<getVehicles>(searchUrl)
  }
  
}
interface getVehicles{
  _embedded: {
    vinentry: getVehicles[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}