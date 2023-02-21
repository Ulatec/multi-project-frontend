import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-application-sub-navigation',
  templateUrl: './application-sub-navigation.component.html',
  styleUrls: ['./application-sub-navigation.component.css']
})
export class ApplicationSubNavigationComponent implements OnInit {
  urlPrefix!: string; 
  constructor(private router: Router) { }
  ngOnInit(): void {
    console.log(`${this.router.url}`)

    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      console.log(`${this.urlPrefix}`)
       this.urlPrefix = e.url 
      });
  
  }

}

