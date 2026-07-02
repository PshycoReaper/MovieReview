import { Routes } from '@angular/router';
import { authGuard } from './MoviewReviewApp/guards/auth-guard';

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

      // Futuro
      // reviews
      // users
      // settings

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
