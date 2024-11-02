import { Injectable, computed, effect, signal } from '@angular/core';

export type Settings = {
  maxScore: number;
  resetToScore: number;
  maxMisses: number;
};

export type Score = {
  score: number;
};

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private settings: Settings = {
    maxScore: 0,
    resetToScore: 0,
    maxMisses: 0,
  };

  private readonly players = signal<string[]>(['Player 1', 'Player 2']);
  private readonly scores = signal<[Score[]]>([
    this.players().map((_, i) => ({ score: 0 })),
  ]);
  private readonly currentPLayerIndex = signal(0);
  private readonly currentPlayerTurn = computed(
    () => this.players()[this.currentPLayerIndex()]
  );
  private readonly currentScore = signal(0);

  // Effect that tracks the current players score and stores it
  ef = effect(
    () => {
      this.scores.update((scores) => {
        scores[scores.length - 1][this.currentPLayerIndex()] = {
          score: this.currentScore(),
        };
        return scores;
      });
    },
    { allowSignalWrites: true }
  );

  // Effect for resetting the score when the player changes
  ef2 = effect(
    () => {
      this.currentPLayerIndex();
      this.getCurrentScore().set(0);
    },
    { allowSignalWrites: true }
  );

  constructor() {}

  setPlayers(players: { name: string }[]) {
    console.log(players);
    this.players.update(() => players.map((x) => x.name));
  }

  getPlayers() {
    return this.players;
  }

  setCurrentPlayerIndex(index: number) {
    this.currentPLayerIndex.update(() => index);
  }

  getCurrentPlayerIndex() {
    return this.currentPLayerIndex;
  }

  getCurrentPlayerTurn() {
    return this.currentPlayerTurn;
  }

  setCurrentPlayerTurn(index: number) {
    this.setCurrentPlayerIndex(index);
  }

  getScore() {
    return this.scores;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  nextTurn() {
    this.currentPLayerIndex.update(
      (index) => (index + 1) % this.players().length
    );

    if (this.scores().length > 0 && this.currentPLayerIndex() === 0) {
      this.scores.update((scores) => {
        scores.push([]);
        return scores;
      });
    }
  }
}
