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
}
