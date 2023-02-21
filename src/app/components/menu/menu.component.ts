import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';
import AppConfig from '../../config/app-config'
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  private storage: Storage = sessionStorage;
  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

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
  logout(){
    //terminate the session with Okta and remove current current tokens
    this.oktaAuth.signOut();
  }
}
