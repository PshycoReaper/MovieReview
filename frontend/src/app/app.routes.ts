import { Routes } from '@angular/router';
import { authGuard } from './MoviewReviewApp/guards/auth-guard';
import { ReviewComponent } from './MoviewReviewApp/components/MoviePage/Review.Component/Review.Component';

import { MovieSearchPage } from './MoviewReviewApp/pages/MovieSearchPage/MovieSearchPage';

import { MovieDashboardPage } from './MoviewReviewApp/pages/adminDashboard/MovieDashboardPage/MovieDashboardPage';


export const routes: Routes = [

  // ==========================
  // Página pública (próximamente)
  // ==========================
  /*{
    path: '',
    loadComponent: () =>
      import('./MoviewReviewApp/pages/home/home.component')
        .then(m => m.HomeComponent),
  },*/

  // ==========================
  // Publicar reseña (genérica, legado)
  // ==========================
  {
    path: 'review',
    component: ReviewComponent
  },

  // ==========================
  // Explorar - TalkFilm
  // ==========================
  {
    path: 'search',
    component: MovieSearchPage
  },

  // ==========================
  // Detalle de película + reseñas de esa película
  // ==========================
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./MoviewReviewApp/pages/MovieDetailPage/MovieDetailPage')
        .then(m => m.MovieDetailPage),
  },

  // ==========================
  // Contacto: pedir cambios de reseña o solicitar películas
  // ==========================
  {
    path: 'contact',
    loadComponent: () =>
      import('./MoviewReviewApp/pages/ContactPage/ContactPage')
        .then(m => m.ContactPage),
  },

  // ==========================
  // Login
  // ==========================
  {
    path: 'login',
    loadComponent: () =>
      import('./MoviewReviewApp/pages/adminAuth/login/login.component')
        .then(m => m.LoginComponent),
  },

  // ==========================
  // Panel de Administración
  // ==========================
  {
    path: 'admin',

    canActivate: [authGuard],

    loadComponent: () =>
      import('./MoviewReviewApp/pages/adminDashboard/adminDashboard')
        .then(m => m.AdminDashboard),

    children: [

      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },

      {
        path: 'main',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/principalDashboard/principalDashboard')
            .then(m => m.PrincipalDashboard),
      },

      {
        path: 'movies',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/MovieDashboardPage/MovieDashboardPage')
            .then(m => m.MovieDashboardPage),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/ReviewDashboardPage/ReviewDashboardPage')
            .then(m => m.ReviewDashboardPage),
      },

      {
        path: 'petitions',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/PetitionDashboardPage/PetitionDashboardPage')
            .then(m => m.PetitionDashboardPage),
      }



    ],
  },

  // ==========================
  // Ruta no encontrada
  // ==========================
  {
    path: '**',
    redirectTo: 'login',
  }

];
