import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentIntent } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { PaymentInfo } from '../common/payment-info';
import { StripeResponse } from '../common/stripe-response';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

//NEEDS TO USE EUREKA NAMING SERVER + API GATEWAY
 settingsApiUrl = "http://localhost:8337";
 stripePaymentIntentUrl = "http://localhost:8337/payment-intent";
 purchaseUrl = "http://localhost:8337/purchase";
 constructor(private httpClient: HttpClient) { }

 
 checkIfSubscriptionActive(email: String): Observable<any>{
  return this.httpClient.get<String>(this.settingsApiUrl + "/isSubscriptionActive/" + email);
}
  createStripePaymentIntent(paymentInfo: PaymentInfo): Observable<any>{
    return this.httpClient.post<PaymentInfo>(this.stripePaymentIntentUrl, paymentInfo);
  }
  purchaseProductTime(result: any): Observable<any>{
    //REFACTOR
    let stripeResponse = new StripeResponse(); 
    stripeResponse.amount = result.paymentIntent.amount;
    stripeResponse.id = result.paymentIntent.id;
    stripeResponse.email = result.paymentIntent.receipt_email;
    stripeResponse.status = result.paymentIntent.status;
    return this.httpClient.post<any>(this.purchaseUrl, stripeResponse);
  }
}
