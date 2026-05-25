import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  menuAbierto = false;

  constructor(public auth: AuthService) {}

  get nombreUsuario(): string {
    return this.auth.usuario?.nombreapellido ?? this.auth.usuario?.username ?? 'Usuario';
  }

  get rolNombre(): string {
    const id = this.auth.idRol;
    switch(id) {
      case 1: return 'Administrador';
      case 2: return 'Admin Operativo';
      case 3: return 'Operario';
      case 4: return 'Cliente';
      default: return '';
    }
  }

  get colorRol(): string {
    switch(this.auth.idRol) {
      case 1: return '#534AB7';
      case 2: return '#0F6E56';
      case 3: return '#993C1D';
      case 4: return '#993556';
      default: return '#0A2342';
    }
  }

  logout(): void {
    this.auth.logout();
  }
}