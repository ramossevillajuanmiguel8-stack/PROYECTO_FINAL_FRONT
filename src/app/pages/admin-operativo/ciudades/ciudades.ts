import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { CiudadService } from '../../../services/api.service';
import { Ciudad } from '../../../models/models';

@Component({
  selector: 'app-ciudades',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './ciudades.html',
  styleUrl: './ciudades.css'
})
export class Ciudades implements OnInit {

  ciudades: Ciudad[] = [];
  ciudadesFiltradas: Ciudad[] = [];
  busqueda = '';
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  ciudadForm: Ciudad = {};

  constructor(private ciudadService: CiudadService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.ciudadService.getAll().subscribe({
      next: (data) => { this.ciudades = data; this.filtrar(); this.cargando = false; },
      error: () => { this.error = 'Error al cargar ciudades.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.ciudadesFiltradas = this.ciudades.filter(c =>
      c.nombre?.toLowerCase().includes(q) || c.pais?.toLowerCase().includes(q)
    );
  }

  abrirCrear(): void { this.ciudadForm = { estado: 'A' }; this.modoEdicion = false; this.modalAbierto = true; this.error = ''; }
  abrirEditar(c: Ciudad): void { this.ciudadForm = { ...c }; this.modoEdicion = true; this.modalAbierto = true; this.error = ''; }
  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.ciudadForm.nombre || !this.ciudadForm.pais) { this.error = 'Nombre y país son obligatorios.'; return; }
    this.ciudadService.save(this.ciudadForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Ciudad actualizada.' : 'Ciudad creada.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta ciudad?')) return;
    this.ciudadService.delete(id).subscribe({
      next: () => { this.exito = 'Ciudad eliminada.'; this.cargar(); setTimeout(() => this.exito = '', 3000); }
    });
  }
}