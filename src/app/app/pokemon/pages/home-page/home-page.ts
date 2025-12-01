import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal
} from '@angular/core';

import { PokemonService } from '../../services/pokemon-service';
import { PaginationService } from '../../services/pagination-service';

import { Breadcrumbs } from "../../../features/components/breadcrumbs/breadcrumbs";
import { HeroPokemon } from "../../../features/components/hero-pokemon/hero-pokemon";
import { Pagination } from "../../../features/components/pagination/pagination";

import { rxResource } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [Breadcrumbs, HeroPokemon, RouterModule, Pagination],
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {

  private pokemonService = inject(PokemonService);
  paginationService = inject(PaginationService);

  charactersPerPage = signal(20);
  totalPages = signal(0);

  constructor() {
    effect(() => {
      if (this.pokemonResource.hasValue()) {
        this.totalPages.set(this.pokemonResource.value()?.count ?? 0);
      }
    });
  }

  // RESOURCE PRINCIPAL DE POKEMON
  pokemonResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.charactersPerPage()
    }),

    stream: ({ params }) => {
      const offset = params.page * params.limit;
      return this.pokemonService.getPokemons(offset, params.limit); // Usar el método correcto
    }
  });

  // EXTRAE ID DESDE URL
  extractId(url: string): number {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]);
  }
}