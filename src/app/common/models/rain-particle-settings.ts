export class RainParticleSettings {
  color: string;
  direction: string;
  globalCompositeOperationOptions: string;
  gradient: CanvasGradient | null;
  name: string;
  sizeModifier: number;
  swirl: boolean;
  velocityModifier: number;

  constructor(color: string, direction: string, globalCompositeOperationOptions: string, gradient: CanvasGradient | null, name: string, sizeModifier: number, swirl: boolean,velocityModifier: number) {
    this.color = color;
    this.direction = direction;
    this.globalCompositeOperationOptions = globalCompositeOperationOptions;
    this.gradient = gradient;
    this.name = name;
    this.sizeModifier = sizeModifier;
    this.swirl = swirl;
    this.velocityModifier = velocityModifier;
  }// =====
}// ==============================
