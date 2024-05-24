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

  get baseTrainingPoint(): number {
    return this.localStorageService.getBaseTp()
  }

  set baseTrainingPoint(value: number) {
    this.localStorageService.setBaseTp(value)
    this.updatePossibility()
  }

  get traingTask(): TrainingTask {
    return this.localStorageService.getTrainingTask()
  }

  set traingTask(value: TrainingTask) {
    this.localStorageService.setTrainingTask(value)
  }

  get fatiguee(): number {
    return this.localStorageService.getFatigue()
  }

  set fatiguee(value: number) {
    this.localStorageService.setFatigue(value)
    this.updatePossibility()
  }

  get targetStat(): Stat {
    return this.localStorageService.getMainStat()
  }

  set targetStat(value: Stat) {
    this.localStorageService.setMainStat(value)
    this.updatePossibility()
  }

  get targetQuality(): TrainingQuality {
    return this.localStorageService.getQuality()
  }

  set targetQuality(value: TrainingQuality) {
    this.localStorageService.setQuality(value)
    this.updatePossibility()
  }

  get statsSet() {
    return this.localStorageService.getStats()
  }

  set statsSet(value: StatsSet) {
    this.localStorageService.setStats(value)
  }

  get usedTp() {
    return this.statsSet.total()
  }

  get percentReach() {
    let percent = 100 * this.statsSet.total() / this.totalTrainingPoint
    if (percent < this.MINIMAL_PROGRESSION) {
      percent = this.MINIMAL_PROGRESSION
    }
    return percent
  }

  get baseHpForBreakpoints(): number {
    return this.localStorageService.getBaseHp()
  }

  set baseHpForBreakpoints(value: number) {
    this.localStorageService.setBaseHp(value)
  }

  get crispr(): Crispr {
    return this.localStorageService.getCrispr()
  }

  set crispr(value: Crispr) {
    this.localStorageService.setCrispr(value)
    this.updatePossibility()
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
        hpAddition: hp, tpAddition: tp
      })

      hp++
    } while (true)

    return breakpoints
  }

  get trainingTask(): TrainingTask {
    return this.localStorageService.getTrainingTask()
  }

  ngOnInit(): void {
    this.updatePossibility()
  }

  numberToWidthStyle(percent: number) {
    return `width: ${percent}%`
  }

  changeCurrentTraining(stat: Stat, value: number) {
    const currentPoint = this.statsSet.get(stat)
    const availablePoint = this.totalTrainingPoint - this.statsSet.total()
    let maximumPoint = currentPoint + availablePoint
    let afterChange = currentPoint + value
    if (afterChange <= 0) {
      afterChange = 0
    } else if (afterChange > maximumPoint) {
      afterChange = maximumPoint
    }

    this.statsSet.set(stat, afterChange)
    this.localStorageService.setStats(this.statsSet)
    this.updatePossibility()
  }

  updatePossibility() {
    const training = new Training(this.totalTrainingPoint, this.fatiguee, this.traingTask, this.statsSet)
    for (const stat of Stat.ALL) {
      const min = training.minimumPossibleImprovement(stat)
      this.minimumPossibility.set(stat, min)
      const max = training.maximumPossibleImprovement(stat)
      this.maximumPossibility.set(stat, max)
    }
  }

  resetStats() {
    this.baseTrainingPoint = 100
    this.crispr = Crispr.NONE
    this.fatiguee = 0
    this.targetStat = Stat.HP
    this.targetQuality = TrainingQuality.COMMON
    this.statsSet = new StatsSet()
    this.updatePossibility()
  }

  increaseBaseHp() {
    this.baseHpForBreakpoints++
  }

  decreaseBaseHp() {
    this.baseHpForBreakpoints--
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

  setCrispr(value: Crispr) {
    this.localStorageService.setCrispr(value)
  }
}
