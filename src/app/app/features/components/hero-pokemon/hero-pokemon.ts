import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-pokemon',
  imports: [],
  templateUrl: './hero-pokemon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroPokemon {
  pokemonCount = input.required<number>();
  totalPage = input.required<number>();
 }

