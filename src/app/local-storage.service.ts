import {Injectable} from '@angular/core';
import Training from "pss-training-lib/dist/Training";
import StatsSet from "pss-training-lib/dist/StatsSet";
import {TrainingTaskHelperService} from "./training-task-helper.service";
import Stat from "pss-training-lib/dist/Stat";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private readonly trainingTaskHelper: TrainingTaskHelperService) {
  }

  readTraining(): Training {
    const totalTp = Number(localStorage.getItem("totalTp")) || 110
    const fatigue = Number(localStorage.getItem("fatigue"))
    let mainStat = localStorage.getItem("mainStat") || Stat.HP.name
    const quality = localStorage.getItem("quality") || TrainingQuality.COMMON.name
    const traningTask = this.trainingTaskHelper.getTrainingTask(mainStat, quality)
    const currentTraining = new StatsSet();
    for (const stat of Stat.ALL) {
      const value = Number(localStorage.getItem(stat.name));
      currentTraining.set(stat, value)
    }
    return new Training(totalTp, fatigue, traningTask, currentTraining);
  }

  saveTraining(value: Training, force = false) {
    const autoSaveMode = this.readSaveOption()
    if (!autoSaveMode && !force) {
      return
    }
    localStorage.setItem("totalTp", value.totalTrainingPoint.toString());
    localStorage.setItem("fatigue", value.fatigue.toString())
    localStorage.setItem("mainStat", value.traingTask.mainStat.name)
    localStorage.setItem("quality", value.traingTask.quality.name)
    for (const stat of Stat.ALL) {
      localStorage.setItem(stat.name, value.currentTraining.get(stat).toString())
    }
  }

  readSaveOption() {
    const autosaveConf = localStorage.getItem("autosave")
    return autosaveConf == "true"
  }

  setSaveOption(value: boolean) {
    localStorage.setItem("autosave", String(value))
  }
}
