import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-no-autorizado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100"
         style="background:linear-gradient(135deg,#0A2342,#1D9E75)">
      <div class="text-center text-white p-5">
        <i class="bi bi-shield-x" style="font-size:5rem;color:#F5C518"></i>
        <h1 class="fw-bold mt-3">Acceso no autorizado</h1>
        <p class="text-white-50 mb-4">No tienes permisos para acceder a esta sección.</p>
        <a routerLink="/login" class="btn btn-warning fw-semibold px-4">
          <i class="bi bi-arrow-left me-2"></i>Volver al login
        </a>
      </div>
    </div>
  `
})
export class NoAutorizado {
  constructor(public auth: AuthService) {}
}