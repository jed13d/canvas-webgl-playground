export class MouseObj {
  x: number;
  y: number;
  radius: number;

  constructor(radius: number, x?: number, y?: number) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.radius = radius ? radius : 150;
  }// ==============================
}// ==============================
