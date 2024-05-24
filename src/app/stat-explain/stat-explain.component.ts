import {Component, EventEmitter, Input, Output} from '@angular/core';
import Stat from "pss-training-lib/dist/Stat";
import {FormsModule} from "@angular/forms";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ImageService} from "../image.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCircleLeft, faCircleMinus, faCirclePlus, faCircleRight} from "@fortawesome/free-solid-svg-icons";

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
  @Input("minimum_possibility") minimumPossibility: number = 0;
  @Input("maximum_possibility") maximumPossibility: number = 0;

  @Output("setTargetStatRequested") setTargetStatRequested = new EventEmitter<Stat>();
  @Output("currentTrainingChangeRequested") currentTrainingChangeRequested = new EventEmitter<number>();
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

  image() {
    return this.imageService.getStatIcon(this.stat);
  }

  requestChangeCurrentTraining(value: number) {
    this.currentTrainingChangeRequested.emit(value)
  }

  protected requestIncreaseCurrentTraining(value: number) {
    this.requestChangeCurrentTraining(value)
  }

  protected requestDecreaseCurrentTraining(value: number) {
    this.requestChangeCurrentTraining(-value)
  }

  protected requestSetTargetStat() {
    this.setTargetStatRequested.emit(this.stat);
  }
}
