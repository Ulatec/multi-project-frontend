import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-header',
  templateUrl: './date-header.component.html',
  styleUrls: ['./date-header.component.css']
})
export class DateHeaderComponent implements OnInit {
  date!: Date;
  constructor() { 
    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  ngOnInit(): void {

  }

}
