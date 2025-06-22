import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FavoritosPage } from './favoritos.page';

describe('FavoritosPage', () => {
  let component: FavoritosPage;
  let fixture: ComponentFixture<FavoritosPage>;
  let mockStorage: jasmine.SpyObj<Storage>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStorage = jasmine.createSpyObj('Storage', ['create', 'get', 'set']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [FavoritosPage],
      providers: [
        { provide: Storage, useValue: mockStorage },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritosPage);
    component = fixture.componentInstance;
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar pokémons favoritos no ngOnInit', async () => {
    const favoritosMock = [
      { id: 1, name: 'bulbasaur', sprites: {} },
      { id: 4, name: 'charmander', sprites: {} }
    ];

    mockStorage.create.and.resolveTo(mockStorage);
    mockStorage.get.and.resolveTo(favoritosMock);

    await component.ngOnInit();

    expect(component.favoritos.length).toBe(2);
    expect(component.favoritos).toEqual(favoritosMock);
    expect(mockStorage.get).toHaveBeenCalledWith('favoritos');
  });

  it('deve remover pokémon favorito', async () => {
    const favoritosMock = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' }
    ];

    component.favoritos = [...favoritosMock];
    component['_storage'] = mockStorage;
    mockStorage.set.and.resolveTo();

    await component.removerFavorito(favoritosMock[0]);

    expect(component.favoritos.length).toBe(1);
    expect(component.favoritos[0].id).toBe(2);
    expect(mockStorage.set).toHaveBeenCalledWith('favoritos', [favoritosMock[1]]);
  });

  it('deve navegar para a página de detalhes', () => {
    const pokemon = { id: 25, name: 'pikachu' };

    component.verDetalhes(pokemon);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/detalhes', pokemon.id]);
  });
});
