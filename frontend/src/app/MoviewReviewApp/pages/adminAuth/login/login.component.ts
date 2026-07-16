import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);


  iniciarSesion() {
    this.authService.login(this.email, this.password).subscribe({
      next: (respuesta: any) => {
        localStorage.setItem('token', respuesta.token);
        sessionStorage.setItem('adminName', respuesta.admin.userName)

        alert('Bienvenido ' + respuesta.admin.userName);
        this.authService.adminName.set(respuesta.admin.userName);

        this.router.navigate(['/admin/main']);
      },

      error: (error: any) => {
        alert(error.error.mensaje);
      },
    });
  }
}
