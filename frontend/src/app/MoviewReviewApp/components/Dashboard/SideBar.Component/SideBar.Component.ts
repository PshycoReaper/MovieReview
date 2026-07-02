import { Component, signal } from '@angular/core';

interface MenuItem {
  title: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'side-bar',
  imports: [],
  templateUrl: './SideBar.Component.html',
})
export class SideBarComponent {
  adminMenu = signal<MenuItem[]>([
    {
      title: 'Panel de Control',
      route: '/dashboard/main',
      active: true,
    },
    {
      title: 'Películas',
      route: '/dashboard/movies',
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
      route: '/logout',
    },
  ]);
}
