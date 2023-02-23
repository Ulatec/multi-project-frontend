import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/common/vehicle';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.css']
})
export class DiscountsComponent implements OnInit {

  vehicles: Vehicle[] = [];
  private pageNumber: number = 0;
  private pageSize: number = 50;
  private totalElements!: number;

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.updateData();
  }

  updateData(){
    this.vehicleService.getVehicles(this.pageNumber - 1, this.pageSize).subscribe(
      this.processResult()
    );
  }
  processResult() {
    return (data: any) => {
      this.vehicles = data._embedded.vinentry;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    }
  }
}
