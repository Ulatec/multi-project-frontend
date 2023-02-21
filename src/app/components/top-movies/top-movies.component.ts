import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/common/movie';
import { BoxofficeService } from 'src/app/services/boxoffice.service';

@Component({
  selector: 'app-top-movies',
  templateUrl: './top-movies.component.html',
  styleUrls: ['./top-movies.component.css']
})
export class TopMoviesComponent implements OnInit {
  movies: Movie[] = [];
  pageNumber: number = 1;
  pageSize: number = 20;
  constructor(private boxOfficeService: BoxofficeService) { }

  ngOnInit(): void {
      this.updateData();
  }
  updateData(){
    this.boxOfficeService.getTopMovies(this.pageNumber - 1, this.pageSize).subscribe(
      this.processResult()
    );
  }
  processResult() {
    return (data: any) => {
      console.log(data);
      this.movies = data._embedded.movies;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
    }
  }
}
