import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'footerComponent',
  imports: [RouterLink],
  templateUrl: './FooterComponent.html',
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  navigation = () => [
    {
      title: 'Inicio',
      route: '/',
    },
    {
      title: 'Películas',
      route: '/movies',
    },
    {
      title: 'Reseñas',
      route: '/reviews',
    },
  ];

  // ================= Panel de administrador =================

  private logoClicks = 0;
  private resetTimer?: ReturnType<typeof setTimeout>;
  private navigationTimer?: ReturnType<typeof setTimeout>;

  logoClick(): void {

    this.logoClicks++;

    // Si ya había una navegación pendiente al inicio, la cancelamos
    if (this.navigationTimer) {
      clearTimeout(this.navigationTimer);
    }

    // Reiniciar contador después de 2 segundos
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    this.resetTimer = setTimeout(() => {
      this.logoClicks = 0;
    }, 2000);

    // Si llega a 5 clics, entra al panel
    if (this.logoClicks >= 5) {

      this.logoClicks = 0;

      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
      }

      this.router.navigate(['/admin/login']);
      return;
    }

    // Si solo fue un clic, esperar un poco por si intenta el easter egg
    this.navigationTimer = setTimeout(() => {

      if (this.logoClicks === 1) {
        this.router.navigate(['/']);
      }

      this.logoClicks = 0;

    }, 350);

  }

}
