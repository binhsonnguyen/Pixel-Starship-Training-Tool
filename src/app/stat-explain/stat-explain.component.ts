import {Component, EventEmitter, Input, Output} from '@angular/core';
import Stat from "pss-training-lib/dist/Stat";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-stat-explain',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSuffix
  ],
  templateUrl: './stat-explain.component.html',
  styleUrl: './stat-explain.component.sass'
})
export class StatExplainComponent {

  @Input("stat") stat?: Stat;
  @Input("current_training") currentTraining: number = 0;
  @Input("training_effect") trainingEffect: number = 0;
  @Input("required_effect") requiredEffect: number = 0;
  @Input("minimum_possibility") minimumPossibility: number = 0;
  @Input("maximum_possibility") maximumPossibility: number = 0;

  @Output("onCurrentTrainingChanged") currentTrainingChanged = new EventEmitter<number>();

  onCurrentTrainingChanged() {
    this.currentTrainingChanged.emit(this.currentTraining)
  }
}
