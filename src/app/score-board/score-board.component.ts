import { Component, inject } from '@angular/core';
import { GameService } from '../game/game.service';

@Component({
  selector: 'app-score-board',
  standalone: true,
  imports: [],
  templateUrl: './score-board.component.html',
  styleUrl: './score-board.component.scss',
})
export class ScoreBoardComponent {
  gameService = inject(GameService);

  score = this.gameService.getScore();
  players = this.gameService.getPlayers();

  getPlayerTotalScore = (index: number) =>
    this.score().reduce((acc, row) => {
      return acc + (row[index] ? row[index].score - row[index].penalty : 0);
    }, 0);

  roundHasPenalty = (round: number) => {
    return this.score()[round].some((x) => x?.penalty);
  };
}
