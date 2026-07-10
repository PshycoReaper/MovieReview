import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
  active?: boolean;
  function?: () => void;
  class?: string;
}

@Component({
  selector: 'side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './SideBar.Component.html',
})
export class SideBarComponent {
  private authService = inject(AuthService);
  adminName = signal<string>(this.authService.adminName());

  adminMenu = signal<MenuItem[]>([
    {
      title: 'Panel de Control',
      route: '/admin/main',
    },
    {
      title: 'Películas',
      route: '/admin/movies',
    },
    {
      title: 'Reseñas',
      route: '/admin/reviews',
    },
    {
      title: 'Peticiones',
      route: '/admin/petitions',
    },
  ]);

  navigationMenu = signal<MenuItem[]>([
    {
      title: 'Ir al sitio',
      route: '/',
    },
    {
      title: 'Explorar películas',
      route: '/movies',
    },
    {
      title: 'Página de contacto',
      route: '/contact',
    },
  ]);

  accountMenu = signal<MenuItem[]>([
    {
      title: 'Cerrar sesión',
      route: '',
      function: () => this.logout(),
      class:
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition',
    },
  ]);
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('adminName');
  }
}
