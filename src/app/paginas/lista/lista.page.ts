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
  IonCardContent,
  IonButtons,
  IonCard,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { PokeApiService } from 'src/app/services/poke-api.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  imports: [
    IonCard,
    IonCardContent,
    IonCol,
    IonToolbar,
    IonMenuButton,
    IonContent,
    IonTitle,
    IonHeader,
    IonButton,
    IonRow,
    IonGrid,
    IonText,
    CommonModule,
    IonButtons
  ],
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {
  pokemons: any[] = [];
  limit = 20;
  offset = 0;
  total = 0;
  carregando = false;

  constructor(
    private pokeApiService: PokeApiService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.carregarPokemons();
  }

  async carregarPokemons() {
    this.carregando = true;

    try {
      const response: any = await firstValueFrom(
        this.pokeApiService.getPokemonList(this.offset, this.limit)
      );

      this.total = response.count; 
      const resultados = response.results;

      this.pokemons = await Promise.all(
        resultados.map(async (pokemon: any) => {
          const detalhes = await this.obterDetalhesPokemon(pokemon.url);
          return {
            ...pokemon,
            ...detalhes,
          };
        })
      );
      console.log(this.pokemons);
    } catch (error) {
      console.error(error);
    } finally {
      this.carregando = false;
    }
  }

  proximaPagina() {
    if (this.offset + this.limit < this.total) {
      this.offset += this.limit;
      this.carregarPokemons();
    }
  }

  paginaAnterior() {
    if (this.offset - this.limit >= 0) {
      this.offset -= this.limit;
      this.carregarPokemons();
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
}
