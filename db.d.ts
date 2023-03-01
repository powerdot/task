type Game = string;

type Partner = {
  id: number;
  name: string;
  games: Game[];
}

type Token = {
  game: Game;
  dep: Game;
  user: number;
}

type DB = {
  partners: Partner[];
  tokens: Token[];
  partnersOrder: number[];
}

export { DB, Partner, Token, Game }