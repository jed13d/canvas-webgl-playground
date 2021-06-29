export class ColorObj {
  blue: number;
  green: number;
  red: number;

  constructor(blue: number = 255, green: number = 255, red: number = 255) {
    this.blue = blue;
    this.green = green;
    this.red = red;
  }// ==============================

  static getBlackRgb(): string {
    return "rgb(0, 0, 0)";
  }// ==============================

  static getRgb(blue: string = "255", green: string = "255", red: string = "255"): string {
    return "rgb("+ red +", "+ green +", "+ blue +")";
  }// ==============================

  static getWhiteRgb(): string {
    return "rgb(255, 255, 255)";
  }// ==============================

  getRgb(): string {
    return "rgb("+ this.red +", "+ this.green +", "+ this.blue +")";
  }// ==============================

  setBlue(blue: number = 255): void {
    this.blue = blue;
  }// ==============================

  setGreen(green: number = 255): void {
    this.green = green;
  }// ==============================

  setRed(red: number = 255): void {
    this.red = red;
  }// ==============================

  setRgb(blue: number = 255, green: number = 255, red: number = 255): void {
    this.blue = blue;
    this.green = green;
    this.red = red;
  }// ==============================

  // "rgb(255, 255, 255)"
  //  012345678901234567
  setFromRgb(rgb: string): void {
    this.blue = parseInt(rgb.substr(4, 3));
    this.green = parseInt(rgb.substr(9, 3));
    this.red = parseInt(rgb.substr(14, 3));
  }// ==============================
}// ==============================
