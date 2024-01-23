import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import StatsSet from "pss-training-lib/dist/StatsSet";
import TrainingTask from "pss-training-lib/dist/TrainingTask";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import {MatInput} from "@angular/material/input";
import Training from "pss-training-lib/dist/Training";
import Stat from "pss-training-lib/dist/Stat";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MatGridTile, MatGridList, CommonModule, MatInput],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  totalTrainingPoint: number = 110
  fatigue: number = 0;
  currentTraining: StatsSet = new StatsSet();
  trainingTask: TrainingTask = TrainingTask.ABL_COMMON
  training: Training = new Training(
    this.totalTrainingPoint,
    this.fatigue,
    this.trainingTask,
    this.currentTraining
  )

  ngOnInit(): void {
    this.currentTraining.hp = 10
  }

  protected readonly Stat = Stat;
}
