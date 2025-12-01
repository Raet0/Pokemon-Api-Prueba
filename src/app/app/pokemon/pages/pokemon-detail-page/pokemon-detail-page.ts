import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PokemonService } from '../../services/pokemon-service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class PokemonDetailPage {
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);

  pokemonDetail = signal<any>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonService.getPokemonDetail(id).subscribe((data) => {
        this.pokemonDetail.set(data);
      });
    }
  }

  getPokemonTypes(): string {
    const types = this.pokemonDetail()?.types || [];
    return types.map((type: any) => type.type.name).join(', ');
  }
}