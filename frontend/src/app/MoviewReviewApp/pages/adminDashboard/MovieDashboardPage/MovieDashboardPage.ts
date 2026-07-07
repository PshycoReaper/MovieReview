import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Movie } from '../../../Interfaces/movie.interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { TmdbService } from '../../../services/movieApi/tmdbService';
import { Title } from '@angular/platform-browser';
import { Genre } from '../../../Interfaces/genre.interface';

@Component({
  selector: 'movie-dashboard-page',
  imports: [ReactiveFormsModule, NgIf, TableComponent],
  templateUrl: './MovieDashboardPage.html',
})


export class MovieDashboardPage {
  //Injeccion del servicio DB
  private DBconexion = inject(DBconexion);
  //INJECCION DEL SERVICIO TMDB
  private tmdbService = inject(TmdbService);

  //PARA ABRIR & CERRRAR MODAL
  mostrarModal: boolean = false;

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.mostrarModal = false;

    this.formulario.reset();

    this.posterPreview.set('');

    this.backdropPreview.set('');

    this.peliculaEditando.set(null);

    this.modoEdicion.set(false);
  }

  //LÓGICA PARA EL FORMULARIO DE AGREGAR MOVIE
  moviesCollection = signal<Movie[]>([]);
  formulario!: FormGroup;



  //PARA EL BUSCADOR DE PELÍCULAS
  buscarControl = new FormControl('');
  resultadosBusqueda = signal<any[]>([]);
  peliculaSeleccionada = signal<any | null>(null);


  //PARA EL GÉNERO DE PELÍCULAS
  genresCatalog = signal<Genre[]>([]);


  //PARA EL POSTER Y EL BANNER DE LA PELICULA, YA QUE MANEJAMOS INPUT FILE
  posterPreview = signal<string>('');
  backdropPreview = signal<string>('');


  //PARA LA LÓGICA DE EDITAR PELICULA
  modoEdicion = signal(false);
  peliculaEditando = signal<Movie | null>(null);


  //TODOS LOS DATOS DEL FORM SON REQUERIDOS
  constructor(private fb: FormBuilder) {
    this.getMovies();

    this.formulario = this.fb.group({
      title: ['', Validators.required],

      overview: ['', Validators.required],

      poster: ['', Validators.required],

      backdrop: ['', Validators.required],

      release_date: ['', Validators.required],

      rating: ['', Validators.required],

      genres: ['', Validators.required],

      languages: ['', Validators.required],
    });

    //PARA EL BUSCADOR
    this.buscarControl.valueChanges.pipe(debounceTime(400), distinctUntilChanged(), switchMap(nombre =>
      this.tmdbService.buscarPeliculas(nombre ?? '')
    )
    ).subscribe(pelis => {
      console.log("SI FUNCIONA");
      this.resultadosBusqueda.set(pelis);
      console.log(this.resultadosBusqueda);
    });

    //PARA EL GÉNERO DE LA PELI

    this.tmdbService.getGenres().subscribe({

      next: response => {

        this.genresCatalog.set(response.genres);

      }

    });

  }



  //SI NO HAY ERRORES O CAMPOS VACÍOS LO ENVIAMOS
  validarPelicula() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    //PROBAMOS CON CONSOLE LOG PRIMERO
    console.log(this.formulario.value);

    if (this.modoEdicion()) {

      this.actualizarPelicula();

    }
    else {

      this.sendPelicula();

    }
    this.cerrarModal();

  }

  //seleccionar película
  seleccionarPelicula(movie: any): void {


    this.peliculaSeleccionada.set(movie);
    //console.log(movie);
    //console.log(movie.releaseDate);

    //PARA LOS IDIOMAS

    const idiomas: Record<string, string> = {

      en: 'Inglés',

      es: 'Español',

      fr: 'Francés',

      ja: 'Japonés',

      ko: 'Coreano'

    };

    //PARA EL GÉNERO

    const nombres = movie.genres
      .map((id: number) => {

        return this.genresCatalog()
          .find(g => g.id === id)?.name;

      })
      .filter(Boolean);

    //PARA LOS POSTERS Y BANNERS

    const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster}`;

    const backdropUrl = `https://image.tmdb.org/t/p/w780${movie.backdrop}`;

    this.posterPreview.set(posterUrl);

    this.backdropPreview.set(backdropUrl);



    this.formulario.patchValue({

      title: movie.title,

      overview: movie.overview,

      release_date: movie.releaseDate,

      genres: nombres.join(', '),

      languages: idiomas[movie.language],

      poster: posterUrl,

      backdrop: backdropUrl,

    });

    console.log(this.formulario.value);

  }

  onPosterSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.formulario.patchValue({
        poster: reader.result as string,
      });
    };

    reader.readAsDataURL(file);

    this.posterPreview.set(URL.createObjectURL(file));

  }

  onBackdropSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.formulario.patchValue({
        backdrop: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
    this.backdropPreview.set(URL.createObjectURL(file));
  }

  sendPelicula() {
    const datosNuevaPeli: Movie = {
      title: this.formulario.value.title,
      overview: this.formulario.value.overview,
      poster: this.formulario.value.poster,
      backdrop: this.formulario.value.backdrop,
      releaseDate: this.formulario.value.release_date,
      rating: this.formulario.value.rating,
      genres: this.formulario.value.genres,
      language: this.formulario.value.languages,
    };

    this.DBconexion.postMovie(datosNuevaPeli).subscribe({
      next: () => {
        console.log('✅ Reseña enviada correctamente');

        // Cerrar y limpiar formulario
        this.cerrarModal();
      },

      error: (err) => {
        console.error('❌ Error al enviar la reseña:', err);
      },
    });
  }

  getMovies() {
    this.DBconexion.getMovies().subscribe({
      next: (response: Movie[]) => {
        console.log(response);
        this.moviesCollection.set(response);
        console.log(this.moviesCollection);
      },

      error: (err) => {
        console.error('❌ Error al obtener las reseñas:', err);
      },
    });
  }

  editarPelicula(movie: Movie) {
    this.modoEdicion.set(true);

    this.peliculaEditando.set(movie);

    this.formulario.patchValue({

      title: movie.title,

      overview: movie.overview,

      release_date: movie.releaseDate,

      rating: movie.rating,

      genres: movie.genres,

      languages: movie.language,
      poster: movie.poster,

      backdrop: movie.backdrop

    });
    this.posterPreview.set(movie.poster);

    this.backdropPreview.set(movie.backdrop);

    this.abrirModal();

  }

  actualizarPelicula() {

    const pelicula: Movie = {

      _id: this.peliculaEditando()?._id,

      title: this.formulario.value.title,

      overview: this.formulario.value.overview,

      poster: this.formulario.value.poster,
      backdrop: this.formulario.value.backdrop,

      releaseDate: this.formulario.value.release_date,

      rating: this.formulario.value.rating,

      genres: this.formulario.value.genres,

      language: this.formulario.value.languages

    };

    this.DBconexion.updateMovie(pelicula._id!, pelicula).subscribe({

        next: (respuesta) => {

            console.log("Película actualizada!!! LO LOGRAMOS", respuesta);
            alert("Película Actualizada Existosamente");

            this.cerrarModal();

        },

        error: (error) => {

            console.error(error);

        }

    });

  }

  eliminarPelicula(movie: Movie) {

    if (!confirm(`¿Eliminar "${movie.title}"?`))
      return;

    this.DBconexion.deleteMovie(movie._id!).subscribe({

        next: (respuesta) => {

            console.log("Película eliminada exitosamente!!", respuesta);
            alert("Película Eliminada Existosamente");
        },

        error: (error) => {

            console.error(error);

        }

    });

  }

}