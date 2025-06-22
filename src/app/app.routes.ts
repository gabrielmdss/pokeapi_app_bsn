import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    loadComponent: () =>
      import('./paginas/lista/lista.page').then((m) => m.ListaPage),
  },
  {
    path: 'detalhes',
    loadComponent: () => import('./paginas/detalhes/detalhes.page').then( m => m.DetalhesPage)
  },
  {
    path: 'detalhes/:id',
    loadComponent: () =>
      import('./paginas/detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: 'favoritos',
    loadComponent: () => import('./paginas/favoritos/favoritos.page').then( m => m.FavoritosPage)
  },
];
