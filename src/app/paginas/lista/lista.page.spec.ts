import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPage } from './lista.page';
import { PokeApiService } from 'src/app/services/poke-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('ListaPage', () => {
  let component: ListaPage;
  let fixture: ComponentFixture<ListaPage>;
  let pokeApiService: jasmine.SpyObj<PokeApiService>;

  beforeEach(async () => {
    const pokeApiServiceSpy = jasmine.createSpyObj('PokeApiService', ['getPokemonList', 'getPokemonById']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule],
      declarations: [ListaPage],
      providers: [
        provideHttpClientTesting(),
        { provide: PokeApiService, useValue: pokeApiServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaPage);
    component = fixture.componentInstance;
    pokeApiService = TestBed.inject(PokeApiService) as jasmine.SpyObj<PokeApiService>;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar lista de pokémons', async () => {
    const mockPokemonList = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }
      ]
    };
    const mockPokemonDetails = { id: 1, name: 'bulbasaur', sprites: { front_default: 'url' } };

    pokeApiService.getPokemonList.and.returnValue(of(mockPokemonList));
    pokeApiService.getPokemonById.and.returnValue(of(mockPokemonDetails));

    await component.carregarPokemons();

    expect(pokeApiService.getPokemonList).toHaveBeenCalled();
    expect(pokeApiService.getPokemonById).toHaveBeenCalled();
    expect(component.pokemons.length).toBeGreaterThan(0);
    expect(component.pokemons[0].name).toBe('bulbasaur');
  });
});
