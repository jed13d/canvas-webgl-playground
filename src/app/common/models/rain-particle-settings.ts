export class RainParticleSettings {
  color: number;
  direction: string;
  globalCompositeOperationOptions: string;
  sizeModifier: number;
  speedModifier: number;
  velocityModifier: number;

  constructor(color: number, direction: string, globalCompositeOperationOptions: string, sizeModifier: number, speedModifier: number, velocityModifier: number) {
    this.color = color;
    this.direction = direction;
    this.globalCompositeOperationOptions = globalCompositeOperationOptions;
    this.sizeModifier = sizeModifier;
    this.speedModifier = speedModifier;
    this.velocityModifier = velocityModifier;
  }// =====
}// ==============================
