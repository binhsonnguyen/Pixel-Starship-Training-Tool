import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule} from "@angular/forms";
import StatsSet from "pss-training-lib/dist/StatsSet";
import TrainingTask from "pss-training-lib/dist/TrainingTask";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  totalTrainingPoint: number = 110
  fatigue: number = 0;
  currentTraining: StatsSet = new StatsSet();
  trainingTask: TrainingTask = TrainingTask.ABL_COMMON
}
