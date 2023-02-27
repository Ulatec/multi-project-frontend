import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators  } from '@angular/forms';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Setting } from 'src/app/common/setting';
import { PurchaseService } from 'src/app/services/purchase.service';
import { SettingsService } from 'src/app/services/settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
    subscriptionExpirationDate!: Date;
    checkoutFormGroup!: FormGroup;
    paymentInfo: PaymentInfo = new PaymentInfo();
    cardElement: any;
    displayError: any = "";
    purchaseDisabled: boolean = true;
    paymentHandler: any = null;
    settings: Setting[] = [];
    subscriptionActive: boolean = false;
    isAuthenticated: boolean = false;
    userFullName: string = '';
    userEmail!: string;
    private storage: Storage = sessionStorage;
  // Initialize Stripe 
  stripe: any;
  elements: any;
  
  
    constructor(private oktaAuthService: OktaAuthStateService,
      @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
      private settingsSerivce: SettingsService, private purchaseService: PurchaseService,
      ) { }
  
    async ngOnInit(): Promise<void> {
    
      this.oktaAuthService.authState$.subscribe(
        (result) => {
          this.isAuthenticated = result.isAuthenticated!;
          this.getUserDetails()
          
        }
      )
    }
    async initStripe() {
      const stripe = await loadStripe(environment.stripePublishableKey);
      const elements = await stripe?.elements;
      return { stripe: stripe, elements: elements };
    }
  
  
    getUserDetails() {
      if(this.isAuthenticated){
        //Fetch the logged in user details
  
        //user full name is exposed as a property name
        this.oktaAuth.getUser().then(
          async (res: any) =>{
            
            this.userFullName = res.name as string;
  
            const email = res.email;
            this.userEmail = email;
            this.getAccountDetails(email);
            this.storage.setItem('userEmail', JSON.stringify(email));
            
          }
        )
      }
    }
    getAccountDetails(email: string){
       this.purchaseService.checkIfSubscriptionActive(email).subscribe(
         this.processResult()
       );
    }
  
    processResult(){
      return async (data: any) => {
        console.log(`AccountInformation: ` + JSON.stringify(data))
        this.subscriptionActive = data.subscriptionActive;
        this.subscriptionExpirationDate = data.subscriptionExpiration;
        if(!this.subscriptionActive){
          console.log(`build form`)
          this.purchaseDisabled = false;
            let initValue = this.initStripe();
          this.stripe = (await initValue).stripe;
          this.elements = (await initValue).elements;
          this.setupStripePaymentForm();
        }
        //this.renderSubscriptionForm();
      }
    }
    setupStripePaymentForm() {
  
      // get a handle to stripe elements
      var elements = this.stripe.elements();
  
      // Create a card element ... and hide the postal code
      this.cardElement = elements.create('card', { hidePostalCode: true });
  
      // Add an instance of card UI component into the 'card-element'
      this.cardElement.mount('#card-element');
  
      // Add event binding for the 'change' event on the card element
      this.cardElement.on('change', (event: any) => {
  
        // get a handle to card-errors element
        this.displayError = document.getElementById('card-errors');
  
        if (event.complete) {
          this.displayError.textContent = "";
        } else if (event.error) {
          // show validation error to customer
          this.displayError.textContent = event.error.message;
        }
  
      });
  
    }
    
    onSubmit() {
      console.log("Handling the submit button");
  

      this.paymentInfo.amount = Math.round(15 * 100);
      this.paymentInfo.currency = "USD";
      this.paymentInfo.email = this.userEmail;

      if (this.displayError.textContent === "") {
        //disable submit button. Avoid multiple submissions.
        this.purchaseDisabled = true;
  
        this.purchaseService.createStripePaymentIntent(this.paymentInfo).subscribe(
          (paymentIntentResponse) => {
            this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: this.userEmail,
                    name: this.userFullName,
                    // address: {
                    //   line1: purchase.billingAddress.street,
                    //   city: purchase.billingAddress.city,
                    //   state: purchase.billingAddress.state,
                    //   postal_code: purchase.billingAddress.zipCode,
                    //   country: this.billingAddressCountry?.value.code
                    // }
                  }
                }
              }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.purchaseDisabled = false;
              } else {
                //console.log(`success: ${JSON.stringify(result)}`)
                this.purchaseService.purchaseProductTime(result).subscribe({
                  next: (response :any) => {
                    //Successful payment
                    alert(`Your have purchased product time.: ${JSON.stringify(response)}`);
                    // reset Purchase Button
                    this.purchaseDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                  }
                })
              }            
            });
          }
        );
      } else {
        this.checkoutFormGroup.markAllAsTouched();
        return;
      }
  
    }
  }
