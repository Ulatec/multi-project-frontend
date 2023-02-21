import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DailyDataComponent } from './components/daily-data/daily-data.component';
import { MenuComponent } from './components/menu/menu.component';
import { DiscountsComponent } from './components/discounts/discounts.component';
import { ApplicationSubNavigationComponent } from './components/application-sub-navigation/application-sub-navigation.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { CommonModule, DatePipe } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import{ OktaAuthGuard, OktaAuthModule, OktaCallbackComponent,OKTA_CONFIG} from '@okta/okta-angular';
import {OktaAuth} from '@okta/okta-auth-js';
import AppConfig from './config/app-config';
import { ForecastComponent } from './components/forecast/forecast.component';
import { DummyProtectedComponent } from './components/dummy-protected/dummy-protected.component';
import { DateHeaderComponent } from './components/date-header/date-header.component';
import { FractalRangeComponent } from './components/fractal-range/fractal-range.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BoxofficeChartsComponent } from './components/boxoffice-charts/boxoffice-charts.component';
import { TopMoviesComponent } from './components/top-movies/top-movies.component';

const oktaConfig = AppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {
  // Use injector to access a service
  const router = injector.get(Router);
  router.navigate(['/login']);
}
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
const routes: Routes = [
  {path: 'dummyProtected', component: DummyProtectedComponent, canActivate: [OktaAuthGuard],
  data: {onAuthRequired: sendToLoginPage} },
  {path: 'boxoffice/chart', component: BoxofficeChartsComponent},
  {path: 'boxoffice/topmovies', component: TopMoviesComponent},
  {path: 'fractalRanges/chart', component: FractalRangeComponent},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'boxoffice/chart', component: ChartComponent},
  {path: 'carvana/forecast', component: ForecastComponent},
  {path: 'carvana/chart', component: ChartComponent},
  {path: 'carvana/rawdata', component: DiscountsComponent},
  {path: 'carvana/discounts', component: DiscountsComponent},
  {path: 'carvana/dailydata', component: DailyDataComponent},
  {path: '', redirectTo: 'carvana/dailydata', pathMatch: 'full'},
  {path: '**', redirectTo: 'carvana/dailydata', pathMatch: 'full'},
];



@NgModule({
  declarations: [
    AppComponent,
    DailyDataComponent,
    MenuComponent,
    DiscountsComponent,
    ApplicationSubNavigationComponent,
    ChartComponent,
    CanvasJSChart,
    LoginComponent,
    DateHeaderComponent,
    FractalRangeComponent,
    BoxofficeChartsComponent,
    TopMoviesComponent
    
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgChartsModule,
    OktaAuthModule,
    CommonModule,
  ],
  providers: [DatePipe,  {provide: OKTA_CONFIG, useValue: {oktaAuth}},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
