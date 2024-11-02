import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'game', component: GameComponent },
];
