import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ResultadoService, PartidoService } from '../../../services/api.service';
import { Resultado, Partido } from '../../../models/models';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css'
})
export class Resultados implements OnInit {

  resultados: Resultado[] = [];
  partidosProgramados: Partido[] = [];
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  resultadoForm: Resultado = {};
  partidoSeleccionado: Partido | null = null;

  constructor(
    private resultadoService: ResultadoService,
    private partidoService: PartidoService
  ) {}

  ngOnInit(): void {
    this.cargarResultados();
    this.cargarPartidosPendientes();
  }

  cargarResultados(): void {
    this.cargando = true;
    this.resultadoService.getAll().subscribe({
      next: (data) => {
        this.resultados = data.sort((a, b) =>
          new Date(b.fechaRegistro ?? '').getTime() - new Date(a.fechaRegistro ?? '').getTime()
        );
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar resultados.'; this.cargando = false; }
    });
  }

  cargarPartidosPendientes(): void {
    this.partidoService.getProgramados().subscribe({
      next: (data) => { this.partidosProgramados = data; }
    });
  }

  seleccionarPartido(p: Partido): void {
    this.partidoSeleccionado = p;
    this.resultadoForm = {
      golesLocal: 0,
      golesVisitante: 0,
      observaciones: '',
      partido: { idPartido: p.idPartido }
    };
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.partidoSeleccionado = null;
    this.error = '';
  }

  get ganadorCalculado(): string {
    const gl = this.resultadoForm.golesLocal ?? 0;
    const gv = this.resultadoForm.golesVisitante ?? 0;
    if (gl > gv) return `Gana ${this.partidoSeleccionado?.equipoLocal?.nombre}`;
    if (gv > gl) return `Gana ${this.partidoSeleccionado?.equipoVisitante?.nombre}`;
    return 'Empate';
  }

  get colorGanador(): string {
    const gl = this.resultadoForm.golesLocal ?? 0;
    const gv = this.resultadoForm.golesVisitante ?? 0;
    if (gl === gv) return '#F5C518';
    return '#1D9E75';
  }

  guardar(): void {
    const gl = this.resultadoForm.golesLocal ?? 0;
    const gv = this.resultadoForm.golesVisitante ?? 0;
    if (gl < 0 || gv < 0) {
      this.error = 'Los goles no pueden ser negativos.'; return;
    }
    this.resultadoService.save(this.resultadoForm).subscribe({
      next: () => {
        this.exito = 'Resultado registrado. Los puntos de predicciones han sido calculados automáticamente.';
        this.cerrarModal();
        this.cargarResultados();
        this.cargarPartidosPendientes();
        setTimeout(() => this.exito = '', 5000);
      },
      error: () => { this.error = 'Error al registrar el resultado.'; }
    });
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  textoGanador(ganador?: string, resultado?: Resultado): string {
    if (ganador === 'E') return 'Empate';
    if (ganador === 'L') return resultado?.partido?.equipoLocal?.nombre ?? 'Local';
    if (ganador === 'V') return resultado?.partido?.equipoVisitante?.nombre ?? 'Visitante';
    return '-';
  }
}