export class Crisp {
  get additionTp(): number {
    return this._additionTp;
  }
  get name(): string {
    return this._name;
  }
  private _name: string;
  private _additionTp: number;

  private constructor(name: string, additionTp: number) {
    this._name = name;
    this._additionTp = additionTp;
  }

  public static readonly NONE: Crisp = new Crisp("No CRISPR", 0);
  public static readonly BRONZE: Crisp = new Crisp("Bronze", 6);
  public static readonly SILVER: Crisp = new Crisp("Silve", 4);
}
