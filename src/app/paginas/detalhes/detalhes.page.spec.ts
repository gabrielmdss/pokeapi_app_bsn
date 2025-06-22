import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalhesPage } from './detalhes.page';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { PokeApiService } from 'src/app/services/poke-api.service';

describe('DetalhesPage', () => {
  let component: DetalhesPage;
  let fixture: ComponentFixture<DetalhesPage>;
  let mockPokemonService: jasmine.SpyObj<PokeApiService>;
  let mockStorage: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    mockPokemonService = jasmine.createSpyObj('PokemonService', ['getPokemonById']);
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(),DetalhesPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([['id', '1']]) }
          }
        },
        { provide: PokeApiService, useValue: mockPokemonService },
        { provide: Storage, useValue: mockStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesPage);
    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar dados do Pokémon no ngOnInit', async () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'url' },
      weight: 10,
      height: 2,
      abilities: []
    };

    mockPokemonService.getPokemonById.and.returnValue(of(mockPokemon));
    mockStorage.create.and.resolveTo(mockStorage);

    await component.ngOnInit();

    expect(mockPokemonService.getPokemonById).toHaveBeenCalledWith(1);
    expect(component.pokemon).toEqual(mockPokemon);
  });

  it('deve adicionar Pokémon aos favoritos', async () => {
    const mockPokemon = { id: 1, name: 'bulbasaur' };
    component.pokemon = mockPokemon;
    component['_storage'] = mockStorage;

    mockStorage.get.and.resolveTo([]);
    mockStorage.set.and.resolveTo();

    await component.favoritarPokemon();

    expect(mockStorage.get).toHaveBeenCalledWith('favoritos');
    expect(mockStorage.set).toHaveBeenCalledWith('favoritos', [mockPokemon]);
  });
});
