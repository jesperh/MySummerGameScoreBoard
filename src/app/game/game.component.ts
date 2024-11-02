import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from './game.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScoreBoardComponent } from '../score-board/score-board.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    ScoreBoardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  router = inject(Router);
  gameService = inject(GameService);
  scoreInput: number = 0;

  score = this.gameService.getCurrentScore();
  players = this.gameService.getPlayers();

  currentPLayerIndex = this.gameService.getCurrentPlayerIndex();
  currentPlayerTurn = this.gameService.getCurrentPlayerTurn();

  nextTurn() {
    this.gameService.nextTurn();
    this.scoreInput = 0;
  }

  constructor() {}
}
