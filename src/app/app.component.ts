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
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageService} from "./local-storage.service";
import {TrainingTaskHelperService} from "./training-task-helper.service";
import {faCircleMinus, faCirclePlus, faCircleRight} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {HpBreakPoint} from "pss-training-lib/dist/HpBreakPoint";
import {Crispr} from "./Crispr";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, StatExplainComponent, NgbModule, FaIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  training: Training = new Training(110, 0, TrainingTask.HP_COMMON, new StatsSet())
  minimumPossibility: StatsSet = new StatsSet()
  maximumPossibility: StatsSet = new StatsSet()
  protected readonly Stat = Stat;
  protected readonly TrainingQuality = TrainingQuality;
  private minimumReachProgressBarWidthInPercent = 15;
  private _crispr = Crispr.NONE
  baseHpForBreakpoints = 10;
  protected readonly faPlus = faCirclePlus;
  protected readonly faMinus = faCircleMinus;

  constructor(private readonly localStorageService: LocalStorageService, private readonly trainingTaskHelper: TrainingTaskHelperService) {
  }

  get autoSave(): boolean {
    return this.localStorageService.readSaveOption();
  }

  set autoSave(value: boolean) {
    this.localStorageService.setSaveOption(value);
  }

  get totalTrainingPoint() {
    return this.training.totalTrainingPoint
  }

  set totalTrainingPoint(value: number) {
    this.training.totalTrainingPoint = value
    this.localStorageService.saveTraining(this.training)
    this.updatePossibility()
  }

  get fatiguee(): number {
    return this.training.fatigue
  }

  set fatiguee(value: number) {
    this.training.fatigue = value
    this.localStorageService.saveTraining(this.training)
    this.updatePossibility()
  }

  get targetStat(): string {
    return this.training.traingTask.mainStat.name
  }

  set targetStat(value: string) {
    this.training.traingTask = this.trainingTaskHelper.getTrainingTask(value, this.targetQuality)
    this.localStorageService.saveTraining(this.training)
    this.updatePossibility()
  }

  get targetQuality(): string {
    return this.training.traingTask.quality.name
  }

  set targetQuality(value: string) {
    this.training.traingTask = this.trainingTaskHelper.getTrainingTask(this.targetStat, value)
    this.localStorageService.saveTraining(this.training)
    this.updatePossibility()
  }

  get trainingTask() {
    return this.training.traingTask
  }

  set trainingTask(task: TrainingTask) {
    this.training.traingTask = task
    this.localStorageService.saveTraining(this.training)
  }

  get currentTraining() {
    return this.training.currentTraining
  }

  set currentTraining(value: StatsSet) {
    this.training.currentTraining = value
    this.localStorageService.saveTraining(this.training)
  }

  get usedTp() {
    return Stat.ALL.reduce((previousValue, currentValue) => {
      return previousValue + this.currentTraining.get(currentValue)
    }, 0)
  }

  get percentReach() {
    let percent = 100 * this.currentTraining.total() / 200
    if (percent < this.minimumReachProgressBarWidthInPercent) {
      percent = this.minimumReachProgressBarWidthInPercent
    }
    return percent
  }

  get percentAvailable() {
    return 100 * this.totalTrainingPoint / 200
  }

  get percentRemaining() {
    return this.percentAvailable - this.percentReach
  }

  get hpBreakpoints() {
    const breakpoints: { hpAddition: number, tpAddition: number }[] = []

    console.log("total", this.totalTrainingPoint)
    let hp = 1
    do {
      const tp = HpBreakPoint
        .withBase(this.baseHpForBreakpoints)
        .withAdditionHp(hp)
        .getValue()
      console.log("tp", tp)
      if (tp > this.totalTrainingPoint) {
        break
      }
      breakpoints.push({
        hpAddition: hp,
        tpAddition: tp
      })

      hp++
    } while (true)

    return breakpoints
  }

  get crispr(): Crispr {
    return this._crispr;
  }

  numberToWidthStyle(percent: number) {
    return `width: ${percent}%`
  }

  ngOnInit(): void {
    this.autoSave = this.localStorageService.readSaveOption()
    this.training = this.localStorageService.readTraining();
    this.updatePossibility();
  }

  updateCurrentTraining(stat: Stat, value: number) {
    this.currentTraining.set(stat, value)
    this.localStorageService.saveTraining(this.training)
    this.updatePossibility()
  }

  updatePossibility() {
    for (const stat of Stat.ALL) {
      const min = this.training.minimumPossibleImprovement(stat)
      this.minimumPossibility.set(stat, min)
      const max = this.training.maximumPossibleImprovement(stat)
      this.maximumPossibility.set(stat, max)
    }
  }

  saveStats() {
    this.localStorageService.saveTraining(this.training, true)
  }

  resetStats() {
    this.totalTrainingPoint = 110
    this.fatiguee = 0
    this.trainingTask = TrainingTask.HP_COMMON
    this.currentTraining = new StatsSet()
    this.updatePossibility()
  }

  increaseBaseHp() {
    this.baseHpForBreakpoints++
  }

  decreaseBaseHp() {
    this.baseHpForBreakpoints--
  }

  toPreviousRarity() {
    switch (this.totalTrainingPoint) {
      case 80:
        this.totalTrainingPoint = 80
        break
      case 90:
        this.totalTrainingPoint = 80
        break
      case 100:
        this.totalTrainingPoint = 90
        break
      case 110:
        this.totalTrainingPoint = 100
        break
      case 200:
        this.totalTrainingPoint = 110
        break
    }
  }

  toNextRarity() {
    switch (this.totalTrainingPoint) {
      case 80:
        this.totalTrainingPoint = 90
        break
      case 90:
        this.totalTrainingPoint = 100
        break
      case 100:
        this.totalTrainingPoint = 110
        break
      case 110:
        this.totalTrainingPoint = 200
        break
      case 200:
        this.totalTrainingPoint = 200
        break
    }
  }

  setCrisprNone() {
    this._crispr = Crispr.NONE
  }

  setCrisprSilver() {
    this._crispr = Crispr.SILVER
  }

  setCrisprBronze() {
    this._crispr = Crispr.BRONZE
  }

  protected readonly Crispr = Crispr;
}
