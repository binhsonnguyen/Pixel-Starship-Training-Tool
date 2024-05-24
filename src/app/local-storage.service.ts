import {Injectable} from '@angular/core';
import StatsSet from "pss-training-lib/dist/StatsSet";
import {TrainingTaskHelperService} from "./training-task-helper.service";
import Stat from "pss-training-lib/dist/Stat";
import TrainingQuality from "pss-training-lib/dist/TrainingQuality";
import TrainingTask from "pss-training-lib/dist/TrainingTask";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly BASE_TP = "base_tp"
  private readonly ADDITION_TP = "addition_tp"
  private readonly FATIGUE = "fatigue";
  private readonly MAIN_STAT = "main_stat";
  private readonly QUALITY = "quality";

  private readonly BASE_HP = "base_hp"

  constructor(private readonly trainingTaskHelper: TrainingTaskHelperService) {
  }

  getBaseTp(): number {
    return Number(localStorage.getItem(this.BASE_TP)) || 110
  }

  setBaseTp(value: number) {
    localStorage.setItem(this.BASE_TP, String(value))
  }

  getAdditionTp(): number {
    return Number(localStorage.getItem(this.ADDITION_TP)) || 0
  }

  setAdditionTp(value: number) {
    localStorage.setItem(this.ADDITION_TP, String(value))
  }

  getFatigue(): number {
    return Number(localStorage.getItem(this.FATIGUE)) || 0
  }

  setFatigue(value: number) {
    localStorage.setItem(this.FATIGUE, String(value))
  }

  getMainStat(): Stat {
    const statName = localStorage.getItem(this.MAIN_STAT)
    switch (statName) {
      case Stat.HP.name:
        return Stat.HP
      case Stat.ATK.name:
        return Stat.ATK
      case Stat.RPR.name:
        return Stat.RPR
      case Stat.ABL.name:
        return Stat.ABL
      case Stat.STA.name:
        return Stat.STA
      case Stat.PLT.name:
        return Stat.PLT
      case Stat.SCI.name:
        return Stat.SCI
      case Stat.ENG.name:
        return Stat.ENG
      case Stat.WPN.name:
        return Stat.WPN
      default:
        return Stat.HP
    }
  }

  setMainStat(value: Stat) {
    localStorage.setItem(this.MAIN_STAT, value.name)
  }

  getQuality(): TrainingQuality {
    const qualityName = localStorage.getItem("quality")
    switch (qualityName) {
      case TrainingQuality.COMMON.name:
        return TrainingQuality.COMMON
      case TrainingQuality.ELITE.name:
        return TrainingQuality.ELITE
      case TrainingQuality.UNIQUE.name:
        return TrainingQuality.UNIQUE
      case TrainingQuality.EPIC.name:
        return TrainingQuality.EPIC
      case TrainingQuality.HERO.name:
        return TrainingQuality.HERO
      case TrainingQuality.SPECIAL.name:
        return TrainingQuality.SPECIAL
      case TrainingQuality.LEGENDARY.name:
        return TrainingQuality.LEGENDARY
      case TrainingQuality.TRAINING_1.name:
        return TrainingQuality.TRAINING_1
      case TrainingQuality.TRAINING_2.name:
        return TrainingQuality.TRAINING_2
      case TrainingQuality.TRAINING_3.name:
        return TrainingQuality.TRAINING_3
      default:
        return TrainingQuality.COMMON
    }
  }

  setQuality(value: TrainingQuality) {
    localStorage.setItem(this.QUALITY, value.name)
  }

  getTrainingTask(): TrainingTask {
    return this.trainingTaskHelper.getTrainingTask(this.getMainStat().name, this.getQuality().name)
  }

  setTrainingTask(value: TrainingTask) {
    this.setMainStat(value.mainStat)
    this.setQuality(value.quality)
  }


  getStats(): StatsSet {
    const stats = new StatsSet();
    for (const stat of Stat.ALL) {
      stats.set(stat, Number(localStorage.getItem(stat.name)) || 0)
    }
    return stats
  }

  setStats(stats: StatsSet) {
    for (const stat of Stat.ALL) {
      localStorage.setItem(stat.name, String(stats.get(stat)))
    }
  }

  getBaseHp(): number {
    return Number(localStorage.getItem(this.BASE_HP)) || 10
  }

  setBaseHp(value: number) {
    localStorage.setItem(this.BASE_HP, String(value))
  }
}
