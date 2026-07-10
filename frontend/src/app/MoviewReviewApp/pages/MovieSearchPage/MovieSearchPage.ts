import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { DBconexion } from "../../services/DataBase/dbconexion";
import { Movie } from "../../Interfaces/movie.interface";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormContactRequest } from "../../shared/FormContactRequest/FormContactRequest";
import { of, switchMap } from "rxjs";

@Component({
    selector: 'app-movie-search',
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './MovieSearchPage.html',
})

export class MovieSearchPage {
    private dbconexion = inject(DBconexion);

    moviesDBMongoArray = signal<Movie[]>([]);

    buscarControlSearch = new FormControl('');
    resultadosPelisBusqueda = signal<any[]>([]);

    //PARA TRAER TODAS LAS PELÍCULAS DE MONGODB
    constructor() {
        this.dbconexion.getMovies().subscribe((movies: Movie[]) => {
            this.moviesDBMongoArray.set(movies)
        })
    }

    //PARA LA BARRA DE BÚSQUEDA
      ngOnInit() {
        this.buscarControlSearch.valueChanges
          .pipe(
            switchMap((nombre) => {
              if (!nombre || nombre.trim().length < 2) {
                this.resultadosPelisBusqueda.set([]);
                return of([]);
              }
    
              return this.dbconexion.getMovieByName(nombre);
            }),
          )
          .subscribe({
            next: (pelis) => {
              this.resultadosPelisBusqueda.set(pelis || []);
            },
    
            error: () => {
              this.resultadosPelisBusqueda.set([]);
            },
          });
      }


}