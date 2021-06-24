export class RainParticleSettings {
  color: string;
  direction: string;
  globalCompositeOperationOptions: string;
  name: string;
  sizeModifier: number;
  velocityModifier: number;

  constructor(color: string, direction: string, globalCompositeOperationOptions: string, name: string, sizeModifier: number, velocityModifier: number) {
    this.color = color;
    this.direction = direction;
    this.globalCompositeOperationOptions = globalCompositeOperationOptions;
    this.name = name;
    this.sizeModifier = sizeModifier;
    this.velocityModifier = velocityModifier;
  }// =====
}// ==============================
