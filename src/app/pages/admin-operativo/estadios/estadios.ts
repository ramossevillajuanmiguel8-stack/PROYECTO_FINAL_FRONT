import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { EstadioService, CiudadService } from '../../../services/api.service';
import { Estadio, Ciudad } from '../../../models/models';

@Component({
  selector: 'app-estadios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './estadios.html',
  styleUrl: './estadios.css'
})
export class Estadios implements OnInit {

  estadios: Estadio[] = [];
  estadiosFiltrados: Estadio[] = [];
  ciudades: Ciudad[] = [];
  busqueda = '';
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  estadioForm: Estadio = {};

  constructor(private estadioService: EstadioService, private ciudadService: CiudadService) {}

  ngOnInit(): void {
    this.cargar();
    this.ciudadService.getAll().subscribe(d => this.ciudades = d);
  }

  cargar(): void {
    this.cargando = true;
    this.estadioService.getAll().subscribe({
      next: (data) => { this.estadios = data; this.filtrar(); this.cargando = false; },
      error: () => { this.error = 'Error al cargar estadios.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.estadiosFiltrados = this.estadios.filter(e =>
      e.nombre?.toLowerCase().includes(q) || e.ciudad?.nombre?.toLowerCase().includes(q)
    );
  }

  abrirCrear(): void {
    this.estadioForm = { estado: 'A', ciudad: {} };
    this.modoEdicion = false; this.modalAbierto = true; this.error = '';
  }

  abrirEditar(e: Estadio): void {
    this.estadioForm = { ...e, ciudad: { idCiudad: e.ciudad?.idCiudad } };
    this.modoEdicion = true; this.modalAbierto = true; this.error = '';
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.estadioForm.nombre || !this.estadioForm.ciudad?.idCiudad) {
      this.error = 'Nombre y ciudad son obligatorios.'; return;
    }
    this.estadioService.save(this.estadioForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Estadio actualizado.' : 'Estadio creado.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este estadio?')) return;
    this.estadioService.delete(id).subscribe({
      next: () => { this.exito = 'Estadio eliminado.'; this.cargar(); setTimeout(() => this.exito = '', 3000); }
    });
  }
}