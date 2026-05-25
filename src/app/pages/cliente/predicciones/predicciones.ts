import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PrediccionService, PartidoService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Prediccion, Partido } from '../../../models/models';

@Component({
  selector: 'app-predicciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './predicciones.html',
  styleUrl: './predicciones.css'
})
export class Predicciones implements OnInit {

  partidos: Partido[] = [];
  misPredicciones: Prediccion[] = [];
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  partidoSeleccionado: Partido | null = null;
  prediccionForm = { golesLocal: 0, golesVisitante: 0 };
  tabActiva: 'partidos' | 'mis' = 'partidos';

  constructor(
    private prediccionService: PrediccionService,
    private partidoService: PartidoService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarPartidos();
    this.cargarMisPredicciones();
  }

  cargarPartidos(): void {
    this.cargando = true;
    this.partidoService.getProgramados().subscribe({
      next: (data) => { this.partidos = data; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
  }

  cargarMisPredicciones(): void {
    const id = this.auth.usuario?.idUsuario;
    if (!id) return;
    this.prediccionService.getByUsuario(id).subscribe({
      next: (data) => { this.misPredicciones = data; }
    });
  }

  yaPredijoPartido(idPartido?: number): boolean {
    return this.misPredicciones.some(p => p.partido?.idPartido === idPartido);
  }

  abrirPrediccion(partido: Partido): void {
    this.partidoSeleccionado = partido;
    this.prediccionForm = { golesLocal: 0, golesVisitante: 0 };
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.partidoSeleccionado = null;
    this.error = '';
  }

  get ganadorPredicho(): string {
    const gl = this.prediccionForm.golesLocal;
    const gv = this.prediccionForm.golesVisitante;
    if (gl > gv) return this.partidoSeleccionado?.equipoLocal?.nombre ?? 'Local';
    if (gv > gl) return this.partidoSeleccionado?.equipoVisitante?.nombre ?? 'Visitante';
    return 'Empate';
  }

  get colorGanador(): string {
    const gl = this.prediccionForm.golesLocal;
    const gv = this.prediccionForm.golesVisitante;
    return gl === gv ? '#F5C518' : '#1D9E75';
  }

  predecir(): void {
    if (!this.partidoSeleccionado) return;
    const prediccion: Prediccion = {
      golesLocalPredicho:     this.prediccionForm.golesLocal,
      golesVisitantePredicho: this.prediccionForm.golesVisitante,
      usuario:  { idUsuario: this.auth.usuario?.idUsuario },
      partido:  { idPartido: this.partidoSeleccionado.idPartido }
    };
    this.prediccionService.save(prediccion).subscribe({
      next: () => {
        this.exito = '¡Predicción registrada exitosamente!';
        this.cerrarModal();
        this.cargarMisPredicciones();
        setTimeout(() => this.exito = '', 3000);
      },
      error: (err) => {
        if (err.status === 409) this.error = 'Ya tienes una predicción para este partido.';
        else if (err.status === 400) this.error = 'Este partido ya no acepta predicciones.';
        else this.error = 'Error al registrar la predicción.';
      }
    });
  }

  eliminarPrediccion(id?: number): void {
    if (!id || !confirm('¿Eliminar esta predicción?')) return;
    this.prediccionService.delete(id).subscribe({
      next: () => {
        this.exito = 'Predicción eliminada.';
        this.cargarMisPredicciones();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  badgeEstadoPrediccion(estado?: string): object {
    return {
      'badge-pendiente': estado === 'P',
      'badge-correcta':  estado === 'C' ,
      'badge-incorrecta': estado === 'I'
    };
  }

  textoEstado(estado?: string): string {
    switch(estado) {
      case 'P': return 'Pendiente';
      case 'C': return 'Correcta';
      case 'I': return 'Incorrecta';
      default: return '-';
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }

  get totalPuntos(): number {
    return this.misPredicciones.reduce((acc, p) => acc + (p.puntosGanados ?? 0), 0);
  }

  get correctas(): number {
    return this.misPredicciones.filter(p => p.estado === 'C' && (p.puntosGanados ?? 0) > 0).length;
  }
}