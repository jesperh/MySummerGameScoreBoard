import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GameService } from '../game/game.service';
import { Observable, debounce, debounceTime, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
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
    RouterModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
  router = inject(Router);
  gameService = inject(GameService);
  settingsForm: FormGroup = new FormGroup({});
  test: any;
  playersSignal: any;

  constructor(private formBuilder: FormBuilder) {
    this.settingsForm = this.formBuilder.group({
      maxScore: this.formBuilder.control(''),
      resetToScore: this.formBuilder.control(''),
      players: this.formBuilder.array([
        this.formBuilder.group({
          name: [''],
        }),
      ]),
    });

    this.playersSignal = toSignal(
      this.settingsForm
        .get('players')!
        .valueChanges.pipe(debounceTime(500), startWith([])),
      { initialValue: [] }
    );

    effect(
      () => {
        this.gameService.setPlayers(this.playersSignal());
      },
      { allowSignalWrites: true }
    );

    // this.test = this.settingsForm
    //   .get('players')
    //   ?.valueChanges.pipe(debounceTime(500))
    //   .subscribe((form) => {
    //     this.gameService.setPlayers(this.players.value);
    //   });
  }

  addPlayer() {
    this.players.push(
      this.formBuilder.group({
        name: this.formBuilder.control(`Player ${this.players.length + 1}`),
      })
    );
  }

  removePlayer(index: number) {
    this.players.removeAt(index);
  }

  startGame() {
    this.router.navigate(['/game']);
  }

  get players() {
    return this.settingsForm.controls['players'] as FormArray;
  }
}
