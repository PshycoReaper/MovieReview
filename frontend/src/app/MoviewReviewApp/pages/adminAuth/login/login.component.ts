import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
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

        alert('Bienvenido ' + respuesta.admin.userName);

        this.router.navigate(['/admin/main']);

      },

      error: (error: any) => {

        alert(error.error.mensaje);

      }

    });

  }

}
