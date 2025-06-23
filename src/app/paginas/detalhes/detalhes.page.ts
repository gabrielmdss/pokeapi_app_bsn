import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
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
    private router: Router,
    private alertController: AlertController
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
      this.mostrarAlerta('Sucesso', 'Pokémon favoritado com sucesso!');
    } else {
      this.mostrarAlerta('Aviso', 'Esse Pokémon já está nos favoritos.');
    }
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK'],
      cssClass: 'meu-alerta-personalizado',
      mode: 'md'
    });
    await alert.present();
  }
}
