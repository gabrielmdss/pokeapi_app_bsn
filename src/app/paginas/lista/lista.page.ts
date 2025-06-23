import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  IonHeader,
  IonButton,
  IonMenuButton,
  IonRow,
  IonGrid,
  IonText,
  IonTitle,
  IonContent,
  IonToolbar,
  IonCol,
  IonSearchbar,
  IonCardContent,
  IonButtons,
  IonSelectOption,
  IonItem,
  IonSelect,
  IonLabel,
  IonCard,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavController, LoadingController } from '@ionic/angular';
import { PokeApiService } from 'src/app/services/poke-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  imports: [
    IonCard,
    IonCardContent,
    IonSelectOption,
    IonSelect,

    IonCol,
    IonItem,
    IonLabel,
    IonToolbar,
    IonMenuButton,
    IonContent,
    IonTitle,
    IonHeader,
    IonButton,
    IonRow,
    IonGrid,
    IonSearchbar,
    IonText,
    CommonModule,
    FormsModule,
    IonButtons,
  ],
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  pokemons: any[] = [];
  pokemonsFiltrados: any[] = [];

  filtro: string = '';

  limit = 20;
  offset = 0;
  total = 0;
  carregando = false;

  constructor(
    private pokeApiService: PokeApiService,
    private navCtrl: NavController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.carregarPokemons();
  }

  async carregarPokemons() {
    const loading = await this.loadingController.create({
      message: 'Carregando Pokémons...',
      spinner: 'crescent',
      translucent: true,
    });
    await loading.present();

    try {
      const response: any = await firstValueFrom(
        this.pokeApiService.getPokemonList(this.offset, this.limit)
      );

      this.pokemons = [];

      for (let result of response.results) {
        const detalhes = await this.obterDetalhesPokemon(result.url);
        this.pokemons.push(detalhes);
      }

      this.total = response.count;
      this.pokemonsFiltrados = [...this.pokemons];
    } catch (error) {
      console.error(error);
    } finally {
      await loading.dismiss();
    }
  }

  filtrarPokemons() {
    const termo = this.filtro.toLowerCase();
    this.pokemonsFiltrados = this.pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(termo)
    );
  }

  async proximaPagina() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      await this.carregarPokemons();
    }
  }

  async paginaAnterior() {
    if (this.offset - this.limit >= 0) {
      this.offset -= this.limit;
      await this.carregarPokemons();
    }
  }

  obterIndiceInicial(): number {
    return this.offset + 1;
  }

  obterIndiceFinal(): number {
    return Math.min(this.offset + this.limit, this.total);
  }

  async obterDetalhesPokemon(url: string): Promise<any> {
    return await firstValueFrom(this.pokeApiService.getPokemonDetails(url));
  }

  irParaDetalhes(id: number) {
    this.navCtrl.navigateForward(`/detalhes/${id}`);
  }

  async alterarLimite() {
    this.offset = 0;
    await this.carregarPokemons();
  }
}
