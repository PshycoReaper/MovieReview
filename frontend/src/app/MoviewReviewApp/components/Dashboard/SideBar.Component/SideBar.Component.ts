import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


interface MenuItem {
  title: string;
  route: string;
  active?: boolean;
  function?: () => void;
  class?: string;
}

@Component({
  selector: 'side-bar',
  imports: [],
  templateUrl: './SideBar.Component.html',
})
export class SideBarComponent {
  private name = signal<string>('');
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
      title: 'Usuarios (opcional)',
      route: '/admin/users',
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
  ]);

  accountMenu = signal<MenuItem[]>([
    {
      title: 'Mi Perfil',
      route: '/profile',
    },
    {
      title: 'Configuración',
      route: '/settings',
    },
    {
      title: 'Cerrar sesión',
      route: '',
      function: () => this.logout(),
      class: "w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 transition"
    },
  ]);
  logout() {
    localStorage.removeItem('token');
  }
}
