import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Setting } from 'src/app/common/setting';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dummy-protected',
  templateUrl: './dummy-protected.component.html',
  styleUrls: ['./dummy-protected.component.css']
})
export class DummyProtectedComponent implements OnInit {
  settings: Setting[] = [];
  subscriptionActive: boolean = false;
  isAuthenticated: boolean = false;
  userFullName: string = '';
  private storage: Storage = sessionStorage;
  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private settingsSerivce: SettingsService
    ) { }

  ngOnInit(): void {

    //subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails()
      }
    )
  }
  getUserDetails() {
    if(this.isAuthenticated){
      //Fetch the logged in user details

      //user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res: any) =>{
          
          this.userFullName = res.name as string;

          const email = res.email;
          this.storage.setItem('userEmail', JSON.stringify(email));
        }
      )
    }
  }
  getAccountDetails(){
    // this.settingsSerivce.getSettings(email: String).subscribe(
    //   this.processResult()
    // );
  }
}
