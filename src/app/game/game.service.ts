import { Injectable, computed, effect, signal } from '@angular/core';

export type Settings = {
  maxScore: number;
  resetToScore: number;
  maxMisses: number;
};

export type Score = {
  score: number;
  penalty: number;
};

export type PenaltyScore = {
  round: number;
  score: number;
  player: number;
};

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private settings: Settings = {
    maxScore: 10,
    resetToScore: 5,
    maxMisses: 0,
  };

  private readonly players = signal<string[]>(['Player 1', 'Player 2']);
  private readonly scores = signal<[Score[]]>([
    this.players().map((_, i) => ({ score: 0, penalty: 0 })),
  ]);
  private readonly currentPLayerIndex = signal(0);
  private readonly currentPlayerTurn = computed(
    () => this.players()[this.currentPLayerIndex()]
  );
  private readonly currentScore = signal(0);

  // These need to be set asReadonly, otherwise their values can be directly updated
  // as using only "readonly" kayword doesn't prevent using the "set" method of a signal.
  currentPlayerIndexForDisplay = this.currentPLayerIndex.asReadonly();
  currentScoreForDisplay = this.currentScore.asReadonly();
  currentPlayerTurnForDisplay = this.currentPlayerTurn;

  // Effect that tracks the current players score and stores it.
  // Note to self: using effect and allowSignalWrites is a code smell.
  // This was a nice learning experience but don't dot it again.
  scoresEffect = effect(
    () => {
      const currentScore = this.currentScore();
      let penalty = 0;

      this.scores.update((scores) => {
        const currentPlayer = this.currentPLayerIndex();
        const currentPlayerScoreBeforeThisRound = this.scores()
          .slice(0, -1)
          .reduce((acc, roundScores) => {
            return (
              acc +
              (roundScores[currentPlayer]
                ? roundScores[currentPlayer].score -
                  roundScores[currentPlayer].penalty
                : 0)
            );
          }, 0);

        const newTotalScore = currentPlayerScoreBeforeThisRound + currentScore;

        if (newTotalScore >= this.settings.maxScore) {
          // If newScore is greater than the max score, player's sore should be
          // set to the resetToScore value. This is done by adding a negative
          // penalty score to the current round.
          penalty = newTotalScore - this.settings.resetToScore;
        }

        scores[scores.length - 1][currentPlayer] = {
          score: currentScore,
          penalty,
        };
        return scores;
      });
    },
    { allowSignalWrites: true }
  );

  winner = computed(() => {
    this.currentPLayerIndex();
    const numColumns = this.scores()[0].length;
    const playerScores = new Array(numColumns).fill(0);

    for (const row of this.scores()) {
      for (let i = 0; i < numColumns; i++) {
        playerScores[i] += row[i]?.score ?? 0;
      }
    }
    const index = playerScores.findIndex((x) => x >= this.settings.maxScore);
    const winner = index >= 0 ? this.players()[index] : null;
    return winner;
  });

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

  setCurrentScore(score: number) {
    this.currentScore.set(score);
  }

  nextTurn() {
    this.currentPLayerIndex.update(
      (index) => (index + 1) % this.players().length
    );

    if (this.scores().length > 0 && this.currentPLayerIndex() === 0) {
      this.scores.update((scores) => {
        scores.push([]);
        return [...scores];
      });
    }

    this.currentScore.set(0);
  }
}
