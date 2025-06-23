import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPage } from './lista.page';
import { PokeApiService } from 'src/app/services/poke-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('ListaPage', () => {
  let component: ListaPage;
  let fixture: ComponentFixture<ListaPage>;
  let pokeApiService: jasmine.SpyObj<PokeApiService>;

  beforeEach(async () => {
    const pokeApiServiceSpy = jasmine.createSpyObj('PokeApiService', [
      'getPokemonList',
      'getPokemonById',
      'getPokemonDetails',
    ]);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ListaPage],
      providers: [
        provideHttpClientTesting(),
        { provide: PokeApiService, useValue: pokeApiServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPage);
    component = fixture.componentInstance;
    pokeApiService = TestBed.inject(
      PokeApiService
    ) as jasmine.SpyObj<PokeApiService>;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar lista de pokémons', async () => {
    const mockPokemonList = {
      count: 1,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
      ],
    };
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'url' },
    };

    pokeApiService.getPokemonList.and.returnValue(of(mockPokemonList));
    pokeApiService.getPokemonDetails.and.returnValue(of(mockPokemonDetails));

    await component.carregarPokemons();

    expect(pokeApiService.getPokemonList).toHaveBeenCalledWith(0, 20);
    expect(pokeApiService.getPokemonDetails).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1/'
    );
    expect(component.pokemons.length).toBeGreaterThan(0);
    expect(component.pokemons[0].name).toBe('bulbasaur');
  });
  it('deve filtrar pokémons pelo nome', () => {
    component.pokemons = [
      { id: 1, name: 'bulbasaur', sprites: { front_default: 'url' } },
      { id: 4, name: 'charmander', sprites: { front_default: 'url' } },
    ];

    component.filtro = 'bulba';
    component.filtrarPokemons();

    expect(component.pokemonsFiltrados.length).toBe(1);
    expect(component.pokemonsFiltrados[0].name).toBe('bulbasaur');
  });
  it('deve alterar o limite e recarregar os pokémons', async () => {
    const mockPokemonList = {
      count: 2,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
      ],
    };
    const mockPokemonDetails = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'url' },
    };

    pokeApiService.getPokemonList.and.returnValue(of(mockPokemonList));
    pokeApiService.getPokemonDetails.and.returnValue(of(mockPokemonDetails));

    component.limit = 50;
    await component.alterarLimite();

    expect(component.offset).toBe(0);
    expect(pokeApiService.getPokemonList).toHaveBeenCalledWith(0, 50);
  });
  it('deve navegar para a próxima página', async () => {
    component.offset = 0;
    component.limit = 20;
    component.total = 100;

    pokeApiService.getPokemonList.and.returnValue(
      of({ count: 100, results: [] })
    );
    pokeApiService.getPokemonDetails.and.returnValue(of({}));

    await component.proximaPagina();

    expect(component.offset).toBe(20);
  });

  it('deve navegar para a página anterior', async () => {
    component.offset = 20;
    component.limit = 20;

    pokeApiService.getPokemonList.and.returnValue(
      of({ count: 100, results: [] })
    );
    pokeApiService.getPokemonDetails.and.returnValue(of({}));

    await component.paginaAnterior();

    expect(component.offset).toBe(0);
  });
  it('deve retornar índice inicial e final corretamente', () => {
    component.offset = 20;
    component.limit = 20;
    component.total = 151;

    expect(component.obterIndiceInicial()).toBe(21);
    expect(component.obterIndiceFinal()).toBe(40);
  });
  it('deve lidar com erro ao carregar pokémons', async () => {
    pokeApiService.getPokemonList.and.throwError('Erro na API');

    try {
      await component.carregarPokemons();
    } catch (e) {
      expect(component.pokemons.length).toBe(0);
    }
  });
});
