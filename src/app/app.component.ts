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
import {MatOption, MatSelect} from "@angular/material/select";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, MatGridTile, MatGridList, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, StatExplainComponent, MatSelect, MatOption],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  training: Training = new Training(110, 0, TrainingTask.HP_COMMON, new StatsSet())
  targetStat: Stat = this.trainingTask.mainStat;
  targetQuality: TrainingQuality = this.trainingTask.quality

  minimumPossibility: StatsSet = new StatsSet()
  maximumPossibility: StatsSet = new StatsSet()

  ngOnInit(): void {
    this.updatePosibility()
  }

  get totalTrainingPoint() {
    return this.training.totalTrainingPoint
  }

  set totalTrainingPoint(value: number) {
    this.training.totalTrainingPoint = value
  }

  get fatigue() {
    return this.training.fatigue
  }

  set fatigue(value: number) {
    this.training.fatigue = value
  }

  get trainingTask() {
    return this.training.traingTask
  }

  set trainingTask(task: TrainingTask) {
    this.training.traingTask = task
  }

  get currentTraining() {
    return this.training.currentTraining
  }

  updateCurrentTraining(stat: Stat, value: number) {
    this.currentTraining.set(stat, value)
    this.updatePosibility()
  }

  onTargetStatChanged(stat: Stat) {
    console.log(stat.name)
    const task = TrainingTask.ALL
      .filter(t => t.mainStat == this.targetStat)
      .find(t => t.quality == this.targetQuality)
    if (!task) {
      throw new Error("no any match")
    }
    this.trainingTask = task
    this.updatePosibility()
  }

  onTargetQualityChanged(targetQuality: TrainingQuality) {
    console.log(targetQuality.name)
    const task = TrainingTask.ALL
      .filter(t => t.mainStat == this.targetStat)
      .find(t => t.quality == this.targetQuality)
    if (!task) {
      throw new Error("no any match")
    }
    this.trainingTask = task
    this.updatePosibility()
  }

  updatePosibility() {
    for (const stat of Stat.ALL) {
      const min = this.training.minimumPossibleImprovement(stat)
      this.minimumPossibility.set(stat, min)
      const max = this.training.maximumPossibleImprovement(stat)
      this.maximumPossibility.set(stat, max)
    }
  }

  protected readonly Stat = Stat;
  protected readonly TrainingQuality = TrainingQuality;
}
