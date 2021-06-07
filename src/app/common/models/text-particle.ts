import { MappedPixel, MouseObj } from 'src/app/common/models';

export class TextParticle {
  private x!: number;
  private y!: number;
  private baseX!: number;
  private baseY!: number;
  private mappedPixel!: MappedPixel;

  private selectedModifierSet: number = 0;
  private modifierSets: {
    avoidSpeed: number;
    returnSpeed: number;
    size: number;
    density: number;
  }[] = [
    {
      avoidSpeed: 50,
      returnSpeed: 10,
      size: 2,
      density: (Math.random() * 159) + 1,
    },
    {
      avoidSpeed: 50,
      returnSpeed: 10,
      size: 1,
      density: (Math.random() * 39) + 1,
    },
  ];

  // -------------------------------
  constructor(x: number, y: number, mappedPixel: MappedPixel) {
    this.x = this.baseX = x;
    this.y = this.baseY = y;
    this.mappedPixel = mappedPixel;
  }// ==============================

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = this.mappedPixel.getColor();
    context.arc(this.x, this.y, this.modifierSets[this.selectedModifierSet].size, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }// ==============================

  update(context: CanvasRenderingContext2D, mouse: MouseObj) {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt((dx * dx) + (dy * dy));

    if(distance <= mouse.radius) {
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let force = (mouse.radius - distance) / mouse.radius;
      let directionX = forceDirectionX * force * this.modifierSets[this.selectedModifierSet].density;
      let directionY = forceDirectionY * force * this.modifierSets[this.selectedModifierSet].density;

      switch(this.selectedModifierSet) {
        case 1:
          this.insideRadiusActionSizeGrow();
          break;
        case 0:
        default:
          this.x -= directionX;
          this.y -= directionY;
          break;
      }// =====
    } else {
      switch(this.selectedModifierSet) {
        case 1:
          this.outsideRadiusActionSizeShrink();
          break;
        case 0:
        default:
          if(this.x !== this.baseX) {
            dx = this.x - this.baseX;
            this.x -= dx / this.modifierSets[this.selectedModifierSet].returnSpeed;
          }
          if(this.y !== this.baseY) {
            dy = this.y - this.baseY;
            this.y -= dy / this.modifierSets[this.selectedModifierSet].returnSpeed;
          }
          break;
      }// =====
    }// =====
  }// ==============================

  private insideRadiusActionSizeGrow() {
    this.modifierSets[this.selectedModifierSet].size = 5;
  }// ==============================

  private outsideRadiusActionSizeShrink() {
    this.modifierSets[this.selectedModifierSet].size = 1;
  }// ==============================

}// ==============================
