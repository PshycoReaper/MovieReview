import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { DBconexion } from "../../services/DataBase/dbconexion";
import { Movie } from "../../Interfaces/movie.interface";

@Component({
    selector: 'app-movie-search',
    imports: [CommonModule],
    templateUrl: './MovieSearchPage.html',
})

export class MovieSearchPage {
    private dbconexion = inject(DBconexion);

    moviesDBMongoArray = signal<Movie[]>([]);

    constructor() {
        this.dbconexion.getMovies().subscribe((movies: Movie[]) => {
            this.moviesDBMongoArray.set(movies)
        })
    }
}