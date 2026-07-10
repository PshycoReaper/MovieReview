import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './NavBarComponent.html',
})
export class NavbarComponent {

  menu = signal([
    {
      title: 'Inicio',
      route: '/',
    },
    {
      title: 'Explorar',
      route: '/movies',
    },
    {
      title: 'Contactanos',
      route: '/contact',
    },
  ]);

}
