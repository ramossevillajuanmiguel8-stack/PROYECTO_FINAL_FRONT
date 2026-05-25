import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { AuthService } from '../../../services/auth.service';
import { PartidoService, PrediccionService } from '../../../services/api.service';
import { Partido, Prediccion } from '../../../models/models';

@Component({
  selector: 'app-inicio-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {

  proximosPartidos: Partido[] = [];
  misPredicciones: Prediccion[] = [];
  puntosTotales = 0;
  prediccionesCorrectas = 0;

  constructor(
    public auth: AuthService,
    private partidoService: PartidoService,
    private prediccionService: PrediccionService
  ) {}

  ngOnInit(): void {
    this.puntosTotales = this.auth.usuario?.puntosTotales ?? 0;

    this.partidoService.getProgramados().subscribe(data => {
      this.proximosPartidos = data.slice(0, 5);
    });

    const idUsuario = this.auth.usuario?.idUsuario;
    if (idUsuario) {
      this.prediccionService.getByUsuario(idUsuario).subscribe(data => {
        this.misPredicciones = data;
        this.prediccionesCorrectas = data.filter(p =>
          p.estado === 'C' && (p.puntosGanados ?? 0) > 0
        ).length;
      });
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
}