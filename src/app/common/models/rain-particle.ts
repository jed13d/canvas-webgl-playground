import { MappedPixel, RainParticleSettings } from 'src/app/common/models';

export class RainParticle {
    // definite assignment allowing call to method to assign without error
    private x!: number;
    private y!: number;
    private size!: number;
    private velocity!: number;

    private canvasWidth: number;
    private canvasHeight: number;
    private speed: number;

    private rainParticleSettings: RainParticleSettings;

    constructor(width: number, height: number, rainParticleSettings: RainParticleSettings) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.speed = 0;
      this.rainParticleSettings = rainParticleSettings;
      this.resetPosition();
    }// ==============================

    draw(context: CanvasRenderingContext2D, mappedImage: MappedPixel[][]) {
      context.beginPath();
      switch(this.rainParticleSettings.color) {
        case 1:
          context.fillStyle = mappedImage[Math.floor(this.y)][Math.floor(this.x)].getColor();
          break;
        case 0:
        default:
          context.fillStyle = 'white';
          break;
      }// =====
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
    }// ==============================

    getSpeed() {
      return this.speed;
    }// ==============================

    resetPosition() {
      this.size = Math.random() * this.rainParticleSettings.sizeModifier;
      this.velocity = Math.random() * this.rainParticleSettings.velocityModifier;

      switch (this.rainParticleSettings.direction) {

        case 'down-left':
          break;

        case 'down-right':
          break;

        case 'up-left':
          break;

        case 'up-right':
          break;

        case 'left':
          break;

        case 'right':
          break;

        case 'up':
          this.y = this.canvasHeight - 1;
          this.x = Math.random() * this.canvasWidth;
          break;

        default:
        case 'down':
          this.y = 0;
          this.x = Math.random() * this.canvasWidth;
          break;
      }// =====
    }// ==============================

    setRainParticleSettings(rainParticleSettings: RainParticleSettings) {
      this.rainParticleSettings = rainParticleSettings;
    }// ==============================

    update(context: CanvasRenderingContext2D, mappedImage: MappedPixel[][]) {
      this.updateMovement();
      this.speed = mappedImage[Math.floor(this.y)][Math.floor(this.x)].getBrightness() * Math.random();
      context.globalCompositeOperation = this.rainParticleSettings.globalCompositeOperationOptions;
      // context.globalAlpha = this.speed;
      this.draw(context, mappedImage);
    }// ==============================

    updateMovement() {
      let movement = (2.5 - this.speed) + this.velocity;

      switch (this.rainParticleSettings.direction) {

        case 'down-left':
          break;

        case 'down-right':
          break;

        case 'up-left':
          break;

        case 'up-right':
          break;

        case 'left':
          break;

        case 'right':
          break;

        case 'up':
          this.y -= movement;
          // if(this.y <= 0) this.resetPosition();
          break;

        default:
        case 'down':
          this.y += movement;
          // if(this.y >= this.canvasHeight) this.resetPosition();
          break;
      }// =====
      if(this.y >= this.canvasHeight || this.x >= this.canvasWidth
        || this.y <= 0 || this.x <= 0) {
        this.resetPosition();
      }// =====
    }// =====
}// ==============================
