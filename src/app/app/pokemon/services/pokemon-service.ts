import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Método obligatorio 1: lista con paginación
  getPokemons(offset: number, limit: number): Observable<any> {
    const url = `${this.baseUrl}?offset=${offset}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  // Método obligatorio 2: detalle
  getPokemonDetail(id: number | string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<any>(url);
  }
}
