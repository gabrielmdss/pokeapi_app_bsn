import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class FavoritosPage implements OnInit {
  favoritos: any[] = [];

  constructor(private storage: Storage, private router: Router) {}

  async ngOnInit() {
    const storageInstance = await this.storage.create();
    this.favoritos = (await storageInstance.get('favoritos')) || [];
  }

  verDetalhes(pokemon: any) {
    this.router.navigate(['/detalhes', pokemon.id]);
  }

  async removerFavorito(pokemon: any) {
    const storageInstance = await this.storage.create();
    this.favoritos = this.favoritos.filter(p => p.id !== pokemon.id);
    await storageInstance.set('favoritos', this.favoritos);
  }
}
