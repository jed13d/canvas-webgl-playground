export class CssColorObj {
  name: string;
  hex: string;
  rgb: string;
  families?: string[] | undefined | null;

  constructor(name: string, hex: string, rgb: string, families: string[]) {
    this.name = name;
    this.hex = hex;
    this.rgb = rgb;
    this.families = families;
  }// ==============================
}// ==============================
