export class RainParticleSettings {
    direction: string;
    globalCompositeOperationOptions: string;
    sizeModifier: number;
    speedModifier: number;
    velocityModifier: number;

    constructor(direction: string, globalCompositeOperationOptions: string, sizeModifier: number, speedModifier: number, velocityModifier: number) {
      this.direction = direction;
      this.globalCompositeOperationOptions = globalCompositeOperationOptions;
      this.sizeModifier = sizeModifier;
      this.speedModifier = speedModifier;
      this.velocityModifier = velocityModifier;
    }// =====
}// ==============================
