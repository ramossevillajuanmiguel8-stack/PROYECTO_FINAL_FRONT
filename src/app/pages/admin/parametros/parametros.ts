import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { ParametroService } from '../../../services/api.service';
import { Parametro } from '../../../models/models';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './parametros.html',
  styleUrl: './parametros.css'
})
export class Parametros implements OnInit {

  parametros: Parametro[] = [];
  parametrosFiltrados: Parametro[] = [];
  busqueda = '';
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  parametroForm: Parametro = {};

  // Parámetros sugeridos del sistema
  sugeridos = [
    { clave: 'MAX_INTENTOS',             descripcion: 'Intentos fallidos antes de bloquear cuenta' },
    { clave: 'PUNTOS_PREDICCION_EXACTA', descripcion: 'Puntos por predecir marcador exacto' },
    { clave: 'PUNTOS_PREDICCION_GANADOR',descripcion: 'Puntos por predecir el ganador' },
    { clave: 'CORREO_EMISOR',            descripcion: 'Correo desde el que se envían notificaciones' },
    { clave: 'DIAS_EXPIRACION_CLAVE',    descripcion: 'Días antes de que expire la contraseña' },
  ];

  constructor(private parametroService: ParametroService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.parametroService.getAll().subscribe({
      next: (data) => { this.parametros = data; this.filtrar(); this.cargando = false; },
      error: () => { this.error = 'Error al cargar parámetros.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.parametrosFiltrados = this.parametros.filter(p =>
      p.clave?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q)
    );
  }

  abrirCrear(): void {
    this.parametroForm = { estado: 'A' };
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
  }

  abrirEditar(p: Parametro): void {
    this.parametroForm = { ...p };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
  }

  usarSugerido(s: { clave: string; descripcion: string }): void {
    this.parametroForm.clave = s.clave;
    this.parametroForm.descripcion = s.descripcion;
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.parametroForm.clave || !this.parametroForm.valor) {
      this.error = 'Clave y valor son obligatorios.'; return;
    }
    this.parametroService.save(this.parametroForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Parámetro actualizado.' : 'Parámetro creado.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el parámetro.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este parámetro?')) return;
    this.parametroService.delete(id).subscribe({
      next: () => { this.exito = 'Parámetro eliminado.'; this.cargar(); setTimeout(() => this.exito = '', 3000); }
    });
  }
}