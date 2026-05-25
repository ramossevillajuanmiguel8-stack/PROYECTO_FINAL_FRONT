import { Routes } from '@angular/router';
import { authGuard, adminGuard, adminOpGuard, operarioGuard, clienteGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Públicas
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/registro/registro').then(m => m.Registro)
  },
  {
    path: 'no-autorizado',
    loadComponent: () => import('./pages/auth/no-autorizado/no-autorizado').then(m => m.NoAutorizado)
  },

  // Admin (idRol = 1)
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'usuarios',   loadComponent: () => import('./pages/admin/usuarios/usuarios').then(m => m.Usuarios) },
      { path: 'roles',      loadComponent: () => import('./pages/admin/roles/roles').then(m => m.Roles) },
      { path: 'parametros', loadComponent: () => import('./pages/admin/parametros/parametros').then(m => m.Parametros) },
      { path: 'auditoria',  loadComponent: () => import('./pages/admin/auditoria/auditoria').then(m => m.AuditoriaComponent) },
      { path: 'reportes',   loadComponent: () => import('./pages/admin/reportes/reportes').then(m => m.Reportes) },
    ]
  },

  // Admin Operativo (idRol = 2)
  {
    path: 'operativo',
    canActivate: [authGuard, adminOpGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin-operativo/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'grupos',    loadComponent: () => import('./pages/admin-operativo/grupos/grupos').then(m => m.Grupos) },
      { path: 'equipos',   loadComponent: () => import('./pages/admin-operativo/equipos/equipos').then(m => m.Equipos) },
      { path: 'estadios',  loadComponent: () => import('./pages/admin-operativo/estadios/estadios').then(m => m.Estadios) },
      { path: 'ciudades',  loadComponent: () => import('./pages/admin-operativo/ciudades/ciudades').then(m => m.Ciudades) },
      { path: 'partidos',  loadComponent: () => import('./pages/admin-operativo/partidos/partidos').then(m => m.Partidos) },
      { path: 'reportes',  loadComponent: () => import('./pages/admin-operativo/reportes/reportes').then(m => m.Reportes) },
    ]
  },

  // Operario (idRol = 3)
  {
    path: 'operario',
    canActivate: [authGuard, operarioGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  loadComponent: () => import('./pages/operario/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'jugadores',  loadComponent: () => import('./pages/operario/jugadores/jugadores').then(m => m.Jugadores) },
      { path: 'resultados', loadComponent: () => import('./pages/operario/resultados/resultados').then(m => m.Resultados) },
    ]
  },

  // Cliente (idRol = 4)
  {
    path: 'cliente',
    canActivate: [authGuard, clienteGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio',       loadComponent: () => import('./pages/cliente/inicio/inicio').then(m => m.Inicio) },
      { path: 'predicciones', loadComponent: () => import('./pages/cliente/predicciones/predicciones').then(m => m.Predicciones) },
      { path: 'ranking',      loadComponent: () => import('./pages/cliente/ranking/ranking').then(m => m.Ranking) },
      { path: 'equipos',      loadComponent: () => import('./pages/cliente/equipos/equipos').then(m => m.EquiposCliente) },
      { path: 'perfil',       loadComponent: () => import('./pages/cliente/perfil/perfil').then(m => m.Perfil) },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];