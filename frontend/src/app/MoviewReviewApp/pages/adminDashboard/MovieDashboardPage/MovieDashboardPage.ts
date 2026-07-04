import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Movie } from '../../../Interfaces/movie.interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DBconexion } from '../../../services/DataBase/dbconexion';
import { TableComponent } from '../../../components/Dashboard/Table.component/Table.component';

@Component({
  selector: 'movie-dashboard-page',
  imports: [ReactiveFormsModule, NgIf, TableComponent],
  templateUrl: './MovieDashboardPage.html',
})
export class MovieDashboardPage {
  //Injeccion del servicio DB
  private DBconexion = inject(DBconexion);

  //PARA ABRIR & CERRRAR MODAL

  mostrarModal: boolean = false;

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  //LÓGICA PARA EL FORMULARIO DE AGREGAR MOVIE

  moviesCollection = signal<Movie[]>([]);

  formulario!: FormGroup;

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
  }

  //SI NO HAY ERRORES O CAMPOS VACÍOS LO ENVIAMOS
  validarPelicula() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    //PROBAMOS CON CONSOLE LOG PRIMERO
    console.log(this.formulario.value);
    this.sendPelicula();

    this.cerrarModal();
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
}

//console.log(datosNuevaPeli); FUNCIONA; REVISAR LO DE LAS IMAGENES

//HACER EL POST PARA LA PELÍCULA
/*
  this.dbConexion.postPelicula(datosNuevaPeli).subscribe({
      next: () => {
        console.log("Película agregada coerrectamente");
        // Cerrar y limpiar formulario
        this.cerrarModal();
      },

      error: () => {
        console.error("Error!!!! A llorar");
      },
    });*/

/*
  // Control del modal
  mostrarModal = false;

  // Formulario
  movieForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.movieForm = this.fb.group({

      id: [0],

      title: ['', Validators.required],

      overview: ['', Validators.required],

      poster: ['', Validators.required],

      backdrop: ['', Validators.required],

      releaseDate: ['', Validators.required],

      rating: [0, [Validators.required, Validators.min(0), Validators.max(10)]],

      genres: [[]],

      language: ['', Validators.required]

    });

  }

  abrirModal(): void {

    this.mostrarModal = true;

  }

  cerrarModal(): void {

    this.mostrarModal = false;

    this.movieForm.reset();

  }

  guardarPelicula(): void {

    if (this.movieForm.invalid) {

      this.movieForm.markAllAsTouched();

      return;

    }

    console.log(this.movieForm.value);


    this.cerrarModal();

  }*/
