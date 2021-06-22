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
          if(Math.random() >= 0.5) {
            this.x = this.canvasWidth - 1;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = 0;
          }
          break;

        case 'down-right':
          if(Math.random() >= 0.5) {
            this.x = 0;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = 0;
          }
          break;

        case 'left':
          this.x = this.canvasWidth - 1;
          this.y = Math.random() * this.canvasHeight;
          break;

        case 'right':
          this.x = 0;
          this.y = Math.random() * this.canvasHeight;
          break;

        case 'up':
          this.x = Math.random() * this.canvasWidth;
          this.y = this.canvasHeight - 1;
          break;

        case 'up-left':
          if(Math.random() >= 0.5) {
            this.x = this.canvasWidth - 1;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = this.canvasHeight - 1;
          }
          break;

        case 'up-right':
        this.x = Math.random() * this.canvasWidth;
          if(Math.random() >= 0.5) {
            this.x = 0;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = this.canvasHeight - 1;
          }
          break;

        default:
        case 'down':
          this.x = Math.random() * this.canvasWidth;
          this.y = 0;
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
      this.draw(context, mappedImage);
    }// ==============================

    updateMovement() {
      let movement = (2.5 - this.speed) + this.velocity;

      switch (this.rainParticleSettings.direction) {

        case 'down-left':
          this.x -= movement;
          this.y += movement;
          break;

        case 'down-right':
          this.x += movement;
          this.y += movement;
          break;

        case 'left':
          this.x -= movement;
          break;

        case 'right':
          this.x += movement;
          break;

        case 'up':
          this.y -= movement;
          break;

        case 'up-left':
          this.x -= movement;
          this.y -= movement;
          break;

        case 'up-right':
          this.x += movement;
          this.y -= movement;
          break;

        default:
        case 'down':
          this.y += movement;
          break;
      }// =====
      if(this.y >= this.canvasHeight || this.x >= this.canvasWidth
        || this.y <= 0 || this.x <= 0) {
        this.resetPosition();
      }// =====
    }// =====
}// ==============================
