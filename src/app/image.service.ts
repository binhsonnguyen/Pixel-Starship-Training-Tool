import { Injectable } from '@angular/core';
import Stat from "pss-training-lib/dist/Stat";

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private static dirPrefix = "assets/stats"

  constructor() { }

  public getStatIcon(stat?: Stat) {
    switch (stat) {
      case Stat.HP:
        return `${ImageService.dirPrefix}/HP.webp`
      case Stat.RPR:
        return `${ImageService.dirPrefix}/Repair.webp`
      case Stat.ATK:
        return `${ImageService.dirPrefix}/Attack.webp`
      case Stat.ABL:
        return `${ImageService.dirPrefix}/Ability.webp`
      case Stat.STA:
        return `${ImageService.dirPrefix}/Stamina.webp`
      case Stat.ENG:
        return `${ImageService.dirPrefix}/Engine.webp`
      case Stat.PLT:
        return `${ImageService.dirPrefix}/Pilot.webp`
      case Stat.SCI:
        return `${ImageService.dirPrefix}/Science.webp`
      case Stat.WPN:
        return `${ImageService.dirPrefix}/Weapon.webp`
      default:
        return ""
    }
  }
}
