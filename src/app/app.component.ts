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
  totalTrainingPoint: number = 110
  fatigue: number = 0;
  currentTraining: StatsSet = new StatsSet();
  trainingTask: TrainingTask = TrainingTask.HP_COMMON
  targetStat: Stat = this.trainingTask.mainStat;
  trainingQuality: TrainingQuality = TrainingQuality.COMMON
  targetQuality: TrainingQuality = this.trainingQuality
  training: Training = new Training(this.totalTrainingPoint, this.fatigue, this.trainingTask, this.currentTraining)

  protected readonly Stat = Stat;

  ngOnInit(): void {
  }

  updateCurrentTraining(stat: Stat, value: number) {
    this.currentTraining.set(stat, value)
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
  }

  private getStatByName(name: string): Stat {
    switch (name) {
      case "HP":
        return Stat.HP
      case "ATK":
        return Stat.ATK
      case "RPR":
        return Stat.RPR
      case "ABL":
        return Stat.ABL
      case "STA":
        return Stat.STA
      case "PLT":
        return Stat.PLT
      case "SCI":
        return Stat.SCI
      case "ENG":
        return Stat.ENG
      case "WPN":
        return Stat.WPN
      default:
        throw new Error("no any matching")
    }
  }
}
