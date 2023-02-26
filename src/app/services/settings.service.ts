import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserSettingRequest } from '../common/user-setting-request';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
   //settingsApiUrl = environment.eurekaNamingServer + "SETTINGS-SERVER/settings/";
   settingsApiUrl = "http://localhost:8337";
  constructor(private httpClient: HttpClient) { }

  setSetting(userSettingRequest: UserSettingRequest): Observable<any>{
    console.log(`Pushing Setting: ${userSettingRequest} ` + JSON.stringify(userSettingRequest))
    return this.httpClient.post<UserSettingRequest>(`${this.settingsApiUrl}/updateSetting`,userSettingRequest );
  }

  getSetting(userSettingRequest: UserSettingRequest): Observable<any>{
    return this.httpClient.get<UserSettingRequest>(`${this.settingsApiUrl}/getSetting/${userSettingRequest.email}/${userSettingRequest.setting.key}`);
  }
  getAllSettings(email: String): Observable<any>{
    return this.httpClient.post<UserSettingRequest>(this.settingsApiUrl + "allSettings?email=" + email, email);
  }
}
