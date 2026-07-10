import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

import { Movie } from '../../../Interfaces/movie.interface';
import { Genre } from '../../../Interfaces/genre.interface';
import { TmdbService } from '../../../services/movieApi/tmdbService';

@Component({
  selector: 'movie-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './MoviewFormComponent.html',
})
export class MovieForm {
  //==========================
  // Inputs / Outputs
  //==========================

  genresCatalog = input.required<Genre[]>();

  save = output<Movie>();

  //==========================
  // Services
  //==========================

  private fb = inject(FormBuilder);
  private tmdbService = inject(TmdbService);

  //==========================
  // Modal
  //==========================

  showModal = signal(false);

  open(movie?: Movie) {
    this.showModal.set(true);

    if (movie) {
      this.modoEdicion.set(true);
      this.peliculaEditando.set(movie);

      this.formulario.patchValue({
        title: movie.title,
        overview: movie.overview,
        poster: movie.poster,
        backdrop: movie.backdrop,
        release_date: movie.releaseDate,
        rating: movie.rating,
        genres: movie.genres,
        languages: movie.language,
      });

      this.posterPreview.set(movie.poster);
      this.backdropPreview.set(movie.backdrop);
    }
  }

  cerrarModal() {
    this.showModal.set(false);

    this.formulario.reset();

    this.posterPreview.set('');
    this.backdropPreview.set('');

    this.resultadosBusqueda.set([]);

    this.buscarControl.setValue('');

    this.modoEdicion.set(false);

    this.peliculaEditando.set(null);
  }

  //==========================
  // Formulario
  //==========================

  formulario: FormGroup = this.fb.group({
    title: ['', Validators.required],
    overview: ['', Validators.required],
    poster: ['', Validators.required],
    backdrop: ['', Validators.required],
    release_date: ['', Validators.required],
    rating: ['', Validators.required],
    genres: ['', Validators.required],
    languages: ['', Validators.required],
  });

  //==========================
  // Buscador TMDB
  //==========================

  buscarControl = new FormControl('');

  resultadosBusqueda = signal<any[]>([]);

  peliculaSeleccionada = signal<any | null>(null);

  ngOnInit() {
    this.buscarControl.valueChanges
      .pipe(
        switchMap((nombre) => {
          if (!nombre || nombre.trim().length < 2) {
            this.resultadosBusqueda.set([]);
            return of([]);
          }

          return this.tmdbService.buscarPeliculas(nombre);
        }),
      )
      .subscribe({
        next: (pelis) => {
          this.resultadosBusqueda.set(pelis || []);
        },

        error: () => {
          this.resultadosBusqueda.set([]);
        },
      });
  }

  //==========================
  // Preview imágenes
  //==========================

  posterPreview = signal('');

  backdropPreview = signal('');

  //==========================
  // Modo edición
  //==========================

  modoEdicion = signal(false);

  peliculaEditando = signal<Movie | null>(null);

  //==========================
  // Seleccionar película TMDB
  //==========================

  seleccionarPelicula(movie: any): void {
  // Ocultar resultados de búsqueda
  this.resultadosBusqueda.set([]);
  this.buscarControl.setValue('');
  this.peliculaSeleccionada.set(movie);

  // Mapeo de idiomas
  const idiomas: Record<string, string> = {
    en: 'Inglés',
    es: 'Español',
    fr: 'Francés',
    ja: 'Japonés',
    ko: 'Coreano',
    de: 'Alemán',
    it: 'Italiano',
    pt: 'Portugués',
    ru: 'Ruso',
    zh: 'Chino',
    ar: 'Árabe',
    hi: 'Hindi',
    nl: 'Holandés',
    pl: 'Polaco',
    sv: 'Sueco',
    da: 'Danés',
    fi: 'Finlandés',
    no: 'Noruego',
    tr: 'Turco',
    el: 'Griego',
    he: 'Hebreo',
    th: 'Tailandés',
    vi: 'Vietnamita'
  };

  // GÉNEROS: manejar tanto genre_ids como genres
  let generosTexto = '';
  if (Array.isArray(movie.genre_ids) || Array.isArray(movie.genres)) {
    const ids = movie.genre_ids || movie.genres;
    generosTexto = ids
      .map((id: number) => {
        const genero = this.genresCatalog().find((g) => g.id === id);
        return genero?.name;
      })
      .filter(Boolean)
      .join(', ');
  } else if (typeof movie.genres === 'string') {
    generosTexto = movie.genres;
  }

  // POSTER: Construir URL completa si es necesario
  // El mapper devuelve poster_path en la propiedad 'poster'
  let posterUrl = '';
  if (movie.poster) {
    // Si movie.poster es un path (empieza con /), construir URL
    if (movie.poster.startsWith('/')) {
      posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster}`;
    } else {
      // Si ya es URL completa, usarla
      posterUrl = movie.poster;
    }
  } else if (movie.poster_path) {
    // Fallback a poster_path si existe
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  }

  // BACKDROP: Construir URL completa si es necesario
  let backdropUrl = '';
  if (movie.backdrop) {
    if (movie.backdrop.startsWith('/')) {
      backdropUrl = `https://image.tmdb.org/t/p/w780${movie.backdrop}`;
    } else {
      backdropUrl = movie.backdrop;
    }
  } else if (movie.backdrop_path) {
    backdropUrl = `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`;
  }

  // Actualizar previsualizaciones (usar las URLs completas)
  this.posterPreview.set(posterUrl);
  this.backdropPreview.set(backdropUrl);

  // IDIOMA: mapear el código de idioma a nombre
  let idioma = '';
  const languageCode = movie.original_language || movie.language;
  if (languageCode) {
    idioma = idiomas[languageCode] || languageCode;
  }

  // RATING: convertir de 0-10 a 0-5
  let rating = '';
  const ratingValue = movie.vote_average || movie.rating;
  if (ratingValue) {
    rating = Math.round(ratingValue / 2).toString();
  }

  // FECHA: obtener release_date
  const fecha = movie.release_date || movie.releaseDate || '';

  console.log('Datos a patch:', {
    title: movie.title,
    overview: movie.overview,
    release_date: fecha,
    rating: rating,
    genres: generosTexto,
    languages: idioma,
    poster: posterUrl,
    backdrop: backdropUrl
  });

  // PATCHEAR el formulario
  this.formulario.patchValue({
    title: movie.title || '',
    overview: movie.overview || '',
    release_date: fecha, // <-- IMPORTANTE: usar el campo correcto
    rating: rating,
    genres: generosTexto,
    languages: idioma, // <-- IMPORTANTE: nombre mapeado
    poster: posterUrl,
    backdrop: backdropUrl,
  });

  // Forzar actualización de validaciones
  this.formulario.updateValueAndValidity();
}
//==========================
// Poster (versión simplificada)
//==========================

onPosterSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];

  // Redimensionar y comprimir
  this.resizeImage(file, 600, 0.7).then((base64) => {
    this.posterPreview.set(base64);
    this.formulario.patchValue({ poster: base64 });
  });
}

//==========================
// Backdrop (versión simplificada)
//==========================

onBackdropSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];

  // Redimensionar y comprimir
  this.resizeImage(file, 1280, 0.5).then((base64) => {
    this.backdropPreview.set(base64);
    this.formulario.patchValue({ backdrop: base64 });
  });
}

//==========================
// Utilidad simplificada
//==========================

private resizeImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/webp', quality));
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}

  //==========================
  // Guardar
  //==========================

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      return;
    }

    const form = this.formulario.getRawValue();

    this.save.emit({
      _id: this.peliculaEditando()?._id,
      title: form.title,
      overview: form.overview,
      poster: form.poster,
      backdrop: form.backdrop,
      releaseDate: form.release_date,
      rating: form.rating,
      genres: form.genres,
      language: form.languages,
    });
  }

  //==========================
  // Validaciones
  //==========================
  validarPelicula(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();

      console.log('❌ Formulario inválido');

      return;
    }

    this.guardar();

    this.cerrarModal();
  }

  esCampoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);

    return !!(control?.invalid && control.touched);
  }

  getMensajeError(campo: string): string {
    const control = this.formulario.get(campo);

    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    return 'Campo inválido';
  }
}
