import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokeApiService {
  baseURL = environment.POKE_API_URL;

  constructor(public http: HttpClient) {
    console.log('Ambiente:', environment.production, 'BaseURL:', this.baseURL);
  }
  getPokemonList(offset: number = 0, limit: number = 20) {
    return this.http.get(
      `${this.baseURL}/pokemon?offset=${offset}&limit=${limit}`
    );
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
  getPokemonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/pokemon/${id}`);
  }
}
