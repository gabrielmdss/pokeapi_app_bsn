# Pokémon Lista - Projeto Ionic/Angular

Este projeto é um aplicativo simples desenvolvido com Ionic e Angular que lista Pokémons consumindo dados da PokeAPI. Ele inclui paginação, detalhes de cada Pokémon, navegação para a página de detalhes e armazenamento local de Pokémons favoritos.

---

## Funcionalidades

- Listagem paginada de Pokémons via API externa (PokeAPI).
- Carregamento dos detalhes de cada Pokémon (imagem, nome, etc).
- Navegação para página de detalhes.
- Controle de carregamento e navegação entre páginas.
- Salvar e remover Pokémons favoritos na memória local do dispositivo.
- Testes unitários para o componente principal.

---

## Tecnologias

- Angular 15+
- Ionic Framework
- RxJS
- Jasmine + Karma (testes unitários)
- TypeScript

---

## Estrutura

- `src/app/paginas/lista/lista.page.ts` - Componente que lista os Pokémons.
- `src/app/services/poke-api.service.ts` - Serviço que consome a PokeAPI.
- Testes unitários na pasta `src/app/paginas/lista` com `lista.page.spec.ts`.

---

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gabrielmdss/pokeapi_app_bsn.git
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o aplicativo

```bash
ionic serve
```

# Executando os testes
## Para rodar os testes unitários:

```bash
npm test
```