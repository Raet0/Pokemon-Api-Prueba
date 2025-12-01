import { Routes } from '@angular/router';
import { LoginPage } from './app/auth/login-page/login-page';
import { HomePage } from './app/pokemon/pages/home-page/home-page';
import { PokemonDetailPage } from './app/pokemon/pages/pokemon-detail-page/pokemon-detail-page';

export const routes: Routes = [
  {
    path:'',
    component: LoginPage
  },
  {
    path:'home',
    component: HomePage,
  },
  {
    path:'pokemon/:id',
    component: PokemonDetailPage,
  },
];
