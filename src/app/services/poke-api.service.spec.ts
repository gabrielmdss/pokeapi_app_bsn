import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { PokeApiService } from './poke-api.service';
import { environment } from 'src/environments/environment.prod';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpMock: HttpTestingController;

  const baseURL = environment.POKE_API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        PokeApiService
      ],
    });

    service = TestBed.inject(PokeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar lista de Pokémons com offset e limit', () => {
    const mockResponse = {
      count: 1126,
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }]
    };

    service.getPokemonList(0, 20).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve buscar detalhes do Pokémon pela URL', () => {
    const url = 'https://pokeapi.co/api/v2/pokemon/1/';
    const mockPokemon = { name: 'bulbasaur' };

    service.getPokemonDetails(url).subscribe(res => {
      expect(res).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('deve buscar Pokémon por ID', () => {
    const id = 1;
    const mockPokemon = { id: 1, name: 'bulbasaur' };

    service.getPokemonById(id).subscribe(res => {
      expect(res).toEqual(mockPokemon);
    });

    const req = httpMock.expectOne(`${baseURL}/pokemon/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });
});
