import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon-service';

interface PokemonItem {
  name: string;
  url: string;
  image?: string;
  id?: number;
}

interface PokemonResponse {
  count: number;
  results: Array<PokemonItem>;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html'
})
export class HomePage implements OnInit {
  offset = signal(0);
  limit = 20;

  pokemonData = signal<PokemonResponse | null>(null);
  isLoading = signal(false);

  items = computed(() => this.pokemonData()?.results || []);
  total = computed(() => this.pokemonData()?.count || 0);
  lastPageStart = computed(() => Math.max(0, Math.floor((this.total() - 1) / this.limit) * this.limit));

  constructor(private svc: PokemonService, private router: Router, private route: ActivatedRoute) {
    effect(() => {
      const offset = this.offset();
      this.loadPokemon(offset);
    });

    this.route.queryParamMap.subscribe(map => {
      const param = map.get('offset');
      if (param !== null && !isNaN(Number(param))) {
        const value = Number(param);
        if (this.offset() !== value) {
          this.offset.set(value);
        }
      }
    });
  }

  ngOnInit(): void {
    const param = this.route.snapshot.queryParamMap.get('offset');
    if (param !== null && !isNaN(Number(param))) {
      this.offset.set(Number(param));
    }
  }

  private loadPokemon(offset: number): void {
    this.isLoading.set(true);
    this.svc.list(offset, this.limit).subscribe({
      next: (data: any) => {
        // Optimización: Generamos la URL de la imagen directamente usando el ID
        // Esto evita hacer 20 peticiones extra y mejora la velocidad.
        const optimizedResults = data.results.map((p: any) => {
          const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
          return {
            ...p,
            id: id,
            // Usamos la URL directa al arte oficial (Official Artwork)
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
          };
        });

        this.pokemonData.set({ ...data, results: optimizedResults });
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  handleImageError(event: any) {
    // Si la imagen falla, muestra un pixel transparente o una imagen por defecto
    event.target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
  }

  next(): void {
    const newOffset = this.offset() + this.limit;
    if (newOffset < this.total()) {
      this.offset.set(newOffset);
      this.scrollToTop();
    }
  }

  prev(): void {
    const newOffset = Math.max(0, this.offset() - this.limit);
    this.offset.set(newOffset);
    this.scrollToTop();
  }

  jumpPages(pages: number): void {
    const delta = pages * this.limit;
    const desired = this.offset() + delta;
    const lastStart = this.lastPageStart();
    const clamped = Math.min(Math.max(0, desired), lastStart);
    this.offset.set(clamped);
    this.scrollToTop();
  }

  jumpForward5(): void {
    this.jumpPages(5);
  }

  jumpBackward5(): void {
    this.jumpPages(-5);
  }

  goToFirstPage(): void {
    this.offset.set(0);
    this.scrollToTop();
  }

  goToDetail(url: string): void {
    const id = this.svc.extractIdFromUrl(url);
    this.router.navigate(['/pokemon', id], { queryParams: { offset: this.offset() } });
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}