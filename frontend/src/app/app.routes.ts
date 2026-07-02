import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./MoviewReviewApp/pages/adminDashboard/adminDashboard')
        .then((m) => m.AdminDashboard),

    children: [
      // Redirección por defecto
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full',
      },

      {
        path: 'main',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/principalDashboard/principalDashboard')
            .then((m) => m.PrincipalDashboard),
      },

      {
        path: 'movies',
        loadComponent: () =>
          import('./MoviewReviewApp/pages/adminDashboard/MovieDashboardPage/MovieDashboardPage')
            .then((m) => m.MovieDashboardPage),
      },

      // Más adelante...
      // {
      //   path: 'reviews',
      //   loadComponent: () =>
      //     import('./MoviewReviewApp/pages/adminDashboard/ReviewDashboardPage/ReviewDashboardPage')
      //       .then((m) => m.ReviewDashboardPage),
      // },
      //
      // {
      //   path: 'users',
      //   loadComponent: () =>
      //     import('./MoviewReviewApp/pages/adminDashboard/UserDashboardPage/UserDashboardPage')
      //       .then((m) => m.UserDashboardPage),
      // },
    ],
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
