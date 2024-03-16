import { Injectable } from '@angular/core';
import TrainingTask from "pss-training-lib/dist/TrainingTask";

@Injectable({
  providedIn: 'root'
})
export class TrainingTaskHelperService {

  constructor() { }

  getTrainingTask(statName: string, qualityName: string): TrainingTask {
    const task = TrainingTask.ALL
      .filter(t => t.mainStat.name == statName)
      .find(t => t.quality.name == qualityName)
    if (!task) {
      throw new Error("no any match")
    }
    return task
  }
}
