import {Component, EventEmitter, Input, Output} from '@angular/core';
import Stat from "pss-training-lib/dist/Stat";
import {FormsModule} from "@angular/forms";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ImageService} from "../image.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {faCircleMinus} from "@fortawesome/free-solid-svg-icons";
import {faCircleRight} from "@fortawesome/free-solid-svg-icons";
import {faCircleLeft} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-stat-explain',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf, NgOptimizedImage, FontAwesomeModule],
  templateUrl: './stat-explain.component.html',
  styleUrl: './stat-explain.component.sass'
})
export class StatExplainComponent {
  faPlus = faCirclePlus;
  faMinus = faCircleMinus;
  faRight = faCircleRight;
  faLeft = faCircleLeft;

  @Input("stat") stat?: Stat;
  @Input("is_main_stat") isMainStat: boolean = false
  @Input("current_training") currentTraining: number = 0;
  @Input("training_effect") trainingEffect: number = 0;
  @Input("required_effect") requiredEffect: number = 0;
  @Input("minimum_possibility") minimumPossibility: number = 0;
  @Input("maximum_possibility") maximumPossibility: number = 0;

  @Output("onSetTargetStat") onSetTargetStat = new EventEmitter<string>();
  @Output("onCurrentTrainingChanged") currentTrainingChanged = new EventEmitter<number>();
  protected readonly TrainingQuality = TrainingQuality;
  private timeoutHandler?: number | null;

  constructor(private imageService: ImageService) {

  }

  get hasEffect(): boolean {
    return this.maximumPossibility > 0
  };

  get hasSideEffect() {
    return !this.isMainStat && this.maximumPossibility > 0
  }

  get posibility() {
    if (this.maximumPossibility <= 0) {
      return "0%"
    } else {
      const roundedRequireEffect = Math.floor(this.requiredEffect)
      const effectivenessPoints = this.trainingEffect - roundedRequireEffect + 1
      const rate = Math.round(effectivenessPoints * 100 / (this.trainingEffect + 1))
      return rate + "%"
    }
  }

  image() {
    return this.imageService.getStatIcon(this.stat);
  }

  onCurrentTrainingChanged() {
    this.currentTrainingChanged.emit(this.currentTraining)
  }

  increaseCurrentTraining(value = 1) {
    this.currentTraining += value
    this.onCurrentTrainingChanged()
  }

  decreaseCurrentTraining(value = 1) {
    let newValue = this.currentTraining - value
    if (newValue < 0) {
      newValue = 0
    }
    this.currentTraining = newValue;
    this.onCurrentTrainingChanged()
  }

  setTargetStat() {
    this.onSetTargetStat.emit(this.stat?.name);
  }
}
