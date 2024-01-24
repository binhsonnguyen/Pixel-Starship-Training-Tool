import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import StatsSet from "pss-training-lib/dist/StatsSet";
import TrainingTask from "pss-training-lib/dist/TrainingTask";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {CommonModule} from "@angular/common";
import Training from "pss-training-lib/dist/Training";
import Stat from "pss-training-lib/dist/Stat";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {StatExplainComponent} from "./stat-explain/stat-explain.component";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MatGridTile, MatGridList, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, StatExplainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  totalTrainingPoint: number = 110
  fatigue: number = 0;
  currentTraining: StatsSet = new StatsSet();
  trainingTask: TrainingTask = TrainingTask.HP_UNIQUE
  training: Training = new Training(this.totalTrainingPoint, this.fatigue, this.trainingTask, this.currentTraining)
  protected readonly Stat = Stat;

  ngOnInit(): void {
  }

  updateCurrentTraining(stat: Stat, value: number) {
    this.currentTraining.set(stat, value)
  }
}
