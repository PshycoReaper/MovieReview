import { Component, signal, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
  icon?: string;
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
      icon: 'bi-speedometer2',
    },
    {
      title: 'Películas',
      route: '/admin/movies',
      icon: 'bi-film',
    },
    {
      title: 'Reseñas',
      route: '/admin/reviews',
      icon: 'bi-chat-square-text-fill',
    },
    {
      title: 'Peticiones',
      route: '/admin/petitions',
      icon: 'bi-inbox-fill',
    },
  ]);

  navigationMenu = signal<MenuItem[]>([
    {
      title: 'Ir al sitio',
      route: '/',
      icon: 'bi-house-door-fill',
    },
    {
      title: 'Explorar películas',
      route: '/movies',
      icon: 'bi-collection-play-fill',
    },
    {
      title: 'Página de contacto',
      route: '/contact',
      icon: 'bi-envelope-fill',
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
