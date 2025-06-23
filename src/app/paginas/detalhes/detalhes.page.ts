import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokeApiService } from 'src/app/services/poke-api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})
export class DetalhesPage implements OnInit {
  id!: number;
  pokemon: any;

  private _storage!: Storage;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokeApiService,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam || isNaN(+idParam)) {
      this.router.navigate(['/lista']);
      return;
    }

    this.id = +idParam;
    this._storage = this.storage;
    await (this._storage as any)['create']();

    this.pokemon = await firstValueFrom(
      this.pokemonService.getPokemonById(this.id)
    );
  }

  async favoritarPokemon() {
    if (!this._storage) return;

    const favoritos = (await this._storage.get('favoritos')) || [];

    if (!favoritos.find((p: any) => p.id === this.pokemon.id)) {
      favoritos.push(this.pokemon);
      await this._storage.set('favoritos', favoritos);
      alert('Pokémon favoritado com sucesso!');
    } else {
      alert('Esse Pokémon já está nos favoritos.');
    }
  }
}
