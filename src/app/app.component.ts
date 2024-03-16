import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from "@angular/forms";
import StatsSet from "pss-training-lib/dist/StatsSet";
import TrainingTask from "pss-training-lib/dist/TrainingTask";
import {CommonModule} from "@angular/common";
import Training from "pss-training-lib/dist/Training";
import Stat from "pss-training-lib/dist/Stat";
import {StatExplainComponent} from "./stat-explain/stat-explain.component";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, StatExplainComponent, NgbModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  training: Training = new Training(110, 0, TrainingTask.HP_COMMON, new StatsSet())
  minimumPossibility: StatsSet = new StatsSet()
  maximumPossibility: StatsSet = new StatsSet()
  defaultFatigue = this.training.fatigue

  ngOnInit(): void {
    this.updatePossibility()
  }

  get totalTrainingPoint() {
    return this.training.totalTrainingPoint
  }

  set totalTrainingPoint(value: number) {
    this.training.totalTrainingPoint = value
    this.updatePossibility()
  }

  get fatiguee(): number {
    return this.training.fatigue
  }

  set fatiguee(value: number) {
    this.training.fatigue = value
    this.updatePossibility()
  }

  get targetStat(): Stat {
    return this.training.traingTask.mainStat
  }

  set targetStat(value: Stat) {
    this.training.traingTask = this.getTrainingTask(value, this.targetQuality)
    this.updatePossibility()
  }

  get targetQuality(): string {
    return this.training.traingTask.quality.name
  }

  set targetQuality(value: string) {
    this.training.traingTask = this.getTrainingTask(this.targetStat, value)
    this.updatePossibility()
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

  get usedTp() {
    return Stat.ALL.reduce((previousValue, currentValue) => {
      return previousValue + this.currentTraining.get(currentValue)
    }, 0)
  }

  updateCurrentTraining(stat: Stat, value: number) {
    this.currentTraining.set(stat, value)
    this.updatePossibility()
  }

  private getTrainingTask(mainStat: Stat, qualityName: string) {
    const task = TrainingTask.ALL
      .filter(t => t.mainStat == mainStat)
      .find(t => t.quality.name == qualityName)
    if (!task) {
      throw new Error("no any match")
    }
    return task
  }

  updatePossibility() {
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
