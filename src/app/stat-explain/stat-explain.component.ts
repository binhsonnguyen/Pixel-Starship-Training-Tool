import {Component, EventEmitter, Input, Output} from '@angular/core';
import Stat from "pss-training-lib/dist/Stat";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-stat-explain',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stat-explain.component.html',
  styleUrl: './stat-explain.component.sass'
})
export class StatExplainComponent {

  @Input("stat") stat?: Stat;
  @Input("is_main_stat") isMainStat: boolean = false
  @Input("current_training") currentTraining: number = 0;
  @Input("training_effect") trainingEffect: number = 0;
  @Input("required_effect") requiredEffect: number = 0;
  @Input("minimum_possibility") minimumPossibility: number = 0;
  @Input("maximum_possibility") maximumPossibility: number = 0;

  @Output("onCurrentTrainingChanged") currentTrainingChanged = new EventEmitter<number>();

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

  onCurrentTrainingChanged() {
    this.currentTrainingChanged.emit(this.currentTraining)
  }
}
