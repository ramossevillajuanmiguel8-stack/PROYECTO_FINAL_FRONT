import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { UsuarioService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/models';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css'
})
export class Ranking implements OnInit {

  ranking: Usuario[] = [];
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getRanking().subscribe({
      next: (data) => { this.ranking = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  esMiPosicion(u: Usuario): boolean {
    return u.idUsuario === this.auth.usuario?.idUsuario;
  }

  getMedalla(index: number): string {
    switch(index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  }

  get miPosicion(): number {
    return this.ranking.findIndex(u => u.idUsuario === this.auth.usuario?.idUsuario) + 1;
  }

  get misPuntos(): number {
    return this.auth.usuario?.puntosTotales ?? 0;
  }
}