export class RainParticleSettings {
  color: number;
  direction: string;
  globalCompositeOperationOptions: string;
  name: string;
  sizeModifier: number;
  speedModifier: number;
  velocityModifier: number;

  constructor(color: number, direction: string, globalCompositeOperationOptions: string, name: string, sizeModifier: number, speedModifier: number, velocityModifier: number) {
    this.color = color;
    this.direction = direction;
    this.globalCompositeOperationOptions = globalCompositeOperationOptions;
    this.name = name;
    this.sizeModifier = sizeModifier;
    this.speedModifier = speedModifier;
    this.velocityModifier = velocityModifier;
  }// =====
}// ==============================
