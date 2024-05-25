import {Component, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {FormsModule} from "@angular/forms"
import StatsSet from "pss-training-lib/dist/StatsSet"
import TrainingTask from "pss-training-lib/dist/TrainingTask"
import {CommonModule} from "@angular/common"
import Training from "pss-training-lib/dist/Training"
import Stat from "pss-training-lib/dist/Stat"
import {StatExplainComponent} from "./stat-explain/stat-explain.component"
import TrainingQuality from "pss-training-lib/dist/TrainingQuality"
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import {LocalStorageService} from "./local-storage.service"
import {TrainingTaskHelperService} from "./training-task-helper.service"
import {faCircleMinus, faCirclePlus} from "@fortawesome/free-solid-svg-icons"
import {FaIconComponent} from "@fortawesome/angular-fontawesome"
import {HpBreakPoint} from "pss-training-lib/dist/HpBreakPoint"
import {Crispr} from "./Crispr"

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, StatExplainComponent, NgbModule, FaIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})

export class AppComponent implements OnInit {
  title: string = "pixel-starship-training-tool"
  protected readonly faPlus = faCirclePlus
  protected readonly faMinus = faCircleMinus
  protected readonly TrainingQuality = TrainingQuality;
  protected readonly Crispr = Crispr;
  protected readonly Stat = Stat;
  private readonly MINIMAL_PROGRESSION = 20

  constructor(private readonly localStorageService: LocalStorageService, private readonly trainingTaskHelper: TrainingTaskHelperService) {
    this._baseTrainingPoint = this.localStorageService.getBaseTp()
    this._fatiguee = this.localStorageService.getFatigue()

    const targetStat = this.localStorageService.getMainStat()
    const trainingQuality = this.localStorageService.getQuality()
    this._trainingTask = this.trainingTaskHelper.getTrainingTask(targetStat.name, trainingQuality.name)

    this._statsSet = this.localStorageService.getStats()
    this._baseHp = this.localStorageService.getBaseHp()
    this._crispr = this.localStorageService.getCrispr()
  }

  private _minimumPossibility: StatsSet = new StatsSet()

  get minimumPossibility(): StatsSet {
    return this._minimumPossibility
  }

  private _maximumPossibility: StatsSet = new StatsSet()

  get maximumPossibility(): StatsSet {
    return this._maximumPossibility
  }

  get totalTrainingPoint() {
    return this.baseTrainingPoint + this.crispr.additionTp
  }

  private _baseTrainingPoint: number

  get baseTrainingPoint(): number {
    return this._baseTrainingPoint
  }

  set baseTrainingPoint(value: number) {
    console.log("set base_tp", value)
    this._baseTrainingPoint = value
    this.localStorageService.setBaseTp(value)
    this.updatePossibility()
  }

  private _fatiguee: number

  get fatiguee(): number {
    return this._fatiguee
  }

  set fatiguee(value: number) {
    console.log("set fatiguee", value)
    this._fatiguee = value
    this.localStorageService.setFatigue(value)
    this.updatePossibility()
  }

  private _trainingTask: TrainingTask

  get targetStat(): Stat {
    return this._trainingTask.mainStat
  }

  set targetStat(value: Stat) {
    console.log("set target stat", value.name)
    this._trainingTask = this.trainingTaskHelper.getTrainingTask(value.name, this.trainingQuality.name)
    this.localStorageService.setMainStat(value)
    this.updatePossibility()
  }

  get trainingQuality(): TrainingQuality {
    return this._trainingTask.quality
  }

  set trainingQuality(value: TrainingQuality) {
    console.log("set quality", value.name)
    this._trainingTask = this.trainingTaskHelper.getTrainingTask(this.targetStat.name, value.name)
    this.localStorageService.setQuality(value)
    this.updatePossibility()
  }

  private _statsSet: StatsSet

  get percentReach() {
    let percent = 100 * this.getTotalStatUsed() / this.totalTrainingPoint
    if (percent < this.MINIMAL_PROGRESSION) {
      percent = this.MINIMAL_PROGRESSION
    }
    return percent
  }

  private _baseHp: number

  get baseHp(): number {
    return this._baseHp
  }

  set baseHp(value: number) {
    console.log("set base_hp", value)
    this._baseHp = value
    this.localStorageService.setBaseHp(value)
  }

  private _crispr: Crispr

  get crispr(): Crispr {
    return this._crispr
  }

  set crispr(value: Crispr) {
    console.log("set crispr", value.name)
    this._crispr = value
    this.localStorageService.setCrispr(value)
    this.updatePossibility()
  }

  get hpBreakpoints() {
    const breakpoints: { hpAddition: number, tpAddition: number }[] = []

    let hp = 1
    do {
      const tp = HpBreakPoint
        .withBase(this.baseHp)
        .withAdditionHp(hp)
        .getValue()
      if (tp > this.totalTrainingPoint) {
        break
      }
      breakpoints.push({
        hpAddition: hp, tpAddition: tp
      })

      hp++
    } while (true)

    return breakpoints
  }

  get trainingTask(): TrainingTask {
    return this.localStorageService.getTrainingTask()
  }

  getTotalStatUsed(): number {
    return this._statsSet.total()
  }

  getStat(stat: Stat): number {
    return this._statsSet.get(stat)
  }

  setStat(stat: Stat, value: number) {
    console.log("set", stat.name, value)
    this._statsSet.set(stat, value)
    this.localStorageService.setStat(stat, value)
  }

  ngOnInit(): void {
    this.updatePossibility()
  }

  numberToWidthStyle(percent: number) {
    return `width: ${percent}%`
  }

  changeCurrentTraining(stat: Stat, value: number) {
    const currentPoint = this.getStat(stat)
    const availablePoint = this.totalTrainingPoint - this.getTotalStatUsed()
    let maximumPoint = currentPoint + availablePoint
    let afterChange = currentPoint + value
    if (afterChange <= 0) {
      afterChange = 0
    } else if (afterChange > maximumPoint) {
      afterChange = maximumPoint
    }

    this.setStat(stat, afterChange)
    this.updatePossibility()
  }

  updatePossibility() {
    const training = new Training(this.totalTrainingPoint, this.fatiguee, this.trainingTask, this._statsSet)
    for (const stat of Stat.ALL) {
      const min = training.minimumPossibleImprovement(stat)
      this.minimumPossibility.set(stat, min)
      const max = training.maximumPossibleImprovement(stat)
      this.maximumPossibility.set(stat, max)
    }
  }

  resetStats() {
    console.log("reset")
    this.baseTrainingPoint = 100
    this.crispr = Crispr.NONE
    this.fatiguee = 0
    this.targetStat = Stat.HP
    this.trainingQuality = TrainingQuality.COMMON
    Stat.ALL.forEach(value => {
      this.setStat(value, 0)
    });
    this.updatePossibility()
  }

  increaseBaseHp() {
    this.baseHp++
  }

  decreaseBaseHp() {
    this.baseHp--
  }

  toPreviousRarity() {
    switch (this.baseTrainingPoint) {
      case 80:
        this.baseTrainingPoint = 80
        break
      case 90:
        this.baseTrainingPoint = 80
        break
      case 100:
        this.baseTrainingPoint = 90
        break
      case 110:
        this.baseTrainingPoint = 100
        break
      case 200:
        this.baseTrainingPoint = 110
        break
    }
  }

  toNextRarity() {
    switch (this.baseTrainingPoint) {
      case 80:
        this.baseTrainingPoint = 90
        break
      case 90:
        this.baseTrainingPoint = 100
        break
      case 100:
        this.baseTrainingPoint = 110
        break
      case 110:
        this.baseTrainingPoint = 200
        break
      case 200:
        this.baseTrainingPoint = 200
        break
    }
  }

}
