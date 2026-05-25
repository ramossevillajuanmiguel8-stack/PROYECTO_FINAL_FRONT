import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ReporteService } from '../../../services/api.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class Reportes {

  descargando: { [key: string]: boolean } = {};

  reportes = [
    {
      id: 'predicciones',
      titulo: 'Predicciones por usuario',
      descripcion: 'Porcentaje de acierto, predicciones correctas e incorrectas por cada usuario.',
      icono: 'bi-lightbulb',
      color: '#993556',
      bg: '#FBEAF0'
    },
    {
      id: 'goles',
      titulo: 'Goles por fase',
      descripcion: 'Total de goles, partidos jugados y promedio por fase del torneo.',
      icono: 'bi-dribbble',
      color: '#1D9E75',
      bg: '#E8F8F2'
    },
    {
      id: 'equipos',
      titulo: 'Rendimiento de equipos',
      descripcion: 'Partidos ganados, empatados, perdidos y diferencia de goles por equipo.',
      icono: 'bi-flag',
      color: '#F5C518',
      bg: '#FEF9E7'
    },
    {
      id: 'ranking',
      titulo: 'Ranking de usuarios',
      descripcion: 'Top usuarios ordenados por puntos acumulados en predicciones.',
      icono: 'bi-trophy',
      color: '#534AB7',
      bg: '#EEF3FE'
    },
    {
      id: 'auditoria',
      titulo: 'Actividad del sistema',
      descripcion: 'Distribución de acciones registradas en el log de auditoría.',
      icono: 'bi-journal-text',
      color: '#993C1D',
      bg: '#FDECEA'
    }
  ];

  constructor(private reporteService: ReporteService) {}

  descargar(id: string, formato: string): void {
    const key = `${id}_${formato}`;
    this.descargando[key] = true;

    switch (id) {
      case 'predicciones': this.reporteService.predicciones(formato); break;
      case 'goles':        this.reporteService.goles(formato);        break;
      case 'equipos':      this.reporteService.equipos(formato);      break;
      case 'ranking':      this.reporteService.ranking(formato);      break;
      case 'auditoria':    this.reporteService.auditoria(formato);    break;
    }

    setTimeout(() => { this.descargando[key] = false; }, 2000);
  }

  estaDescargando(id: string, formato: string): boolean {
    return !!this.descargando[`${id}_${formato}`];
  }
}