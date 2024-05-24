export class Crispr {
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

  public static readonly NONE: Crispr = new Crispr("No CRISPR", 0);
  public static readonly BRONZE: Crispr = new Crispr("Bronze", 6);
  public static readonly SILVER: Crispr = new Crispr("Silver", 10);
}
