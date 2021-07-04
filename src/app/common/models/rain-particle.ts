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
    private angle: number;

    private rainParticleSettings: RainParticleSettings;

    static availableDirections: string[] = [
      "down", "down-left", "down-right", "left", "right", "up", "up-left", "up-right"
    ];

    static availableColorSettings: string[] = [
      "gradient", "image-mapping"
    ];

    constructor(width: number, height: number, rainParticleSettings: RainParticleSettings) {
      this.angle = Math.PI / 2;
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.speed = 0;
      this.rainParticleSettings = rainParticleSettings;
      this.resetPosition();
    }// ==============================

    draw(context: CanvasRenderingContext2D, mappedImage: MappedPixel[][]) {
      context.beginPath();
      switch(this.rainParticleSettings.color) {
        case RainParticle.availableColorSettings[0]:
          if(this.rainParticleSettings.gradient !== null) {
            // console.log("RainParticle Gradient");
            context.fillStyle = this.rainParticleSettings.gradient;
          }
          break;
        case RainParticle.availableColorSettings[1]:
          context.fillStyle = mappedImage[Math.floor(this.y)][Math.floor(this.x)].getColor();
          break;
        default:
          context.fillStyle = this.rainParticleSettings.color;
          break;
      }
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

        case RainParticle.availableDirections[1]:
          if(Math.random() >= 0.5) {
            this.x = this.canvasWidth - 1;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = 0;
          }
          break;

        case RainParticle.availableDirections[2]:
          if(Math.random() >= 0.5) {
            this.x = 0;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = 0;
          }
          break;

        case RainParticle.availableDirections[3]:
          this.x = this.canvasWidth - 1;
          this.y = Math.random() * this.canvasHeight;
          break;

        case RainParticle.availableDirections[4]:
          this.x = 0;
          this.y = Math.random() * this.canvasHeight;
          break;

        case RainParticle.availableDirections[5]:
          this.x = Math.random() * this.canvasWidth;
          this.y = this.canvasHeight - 1;
          break;

        case RainParticle.availableDirections[6]:
          if(Math.random() >= 0.5) {
            this.x = this.canvasWidth - 1;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = this.canvasHeight - 1;
          }
          break;

        case RainParticle.availableDirections[7]:
        this.x = Math.random() * this.canvasWidth;
          if(Math.random() >= 0.5) {
            this.x = 0;
            this.y = Math.random() * this.canvasHeight;
          } else {
            this.x = Math.random() * this.canvasWidth;
            this.y = this.canvasHeight - 1;
          }
          break;

        case RainParticle.availableDirections[8]:
        default:
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
      let sinOfAngle = 0;
      let cosOfAngle = 0;
      if(this.rainParticleSettings.swirl) {
        this.angle += this.speed / 20;
        sinOfAngle = Math.sin(this.angle) * 2;
        cosOfAngle = Math.cos(this.angle) * 2;
      } else {
        sinOfAngle = cosOfAngle = 1;
      }// =====

      switch (this.rainParticleSettings.direction) {

        case RainParticle.availableDirections[1]:
          this.x -= movement * cosOfAngle;
          this.y += movement * sinOfAngle;
          break;

        case RainParticle.availableDirections[2]:
          this.x += movement * cosOfAngle;
          this.y += movement * sinOfAngle;
          break;

        case RainParticle.availableDirections[3]:
          this.x -= movement * cosOfAngle;
          break;

        case RainParticle.availableDirections[4]:
          this.x += movement * cosOfAngle;
          break;

        case RainParticle.availableDirections[5]:
          this.y -= movement * cosOfAngle;
          break;

        case RainParticle.availableDirections[6]:
          this.x -= movement * cosOfAngle;
          this.y -= movement * sinOfAngle;
          break;

        case RainParticle.availableDirections[7]:
          this.x += movement * cosOfAngle;
          this.y -= movement * sinOfAngle;
          break;

        case RainParticle.availableDirections[8]:
        default:
          this.y += movement * cosOfAngle;
          break;
      }// =====
      if(this.y >= this.canvasHeight || this.x >= this.canvasWidth
        || this.y <= 0 || this.x <= 0) {
        this.resetPosition();
      }// =====
    }// =====
}// ==============================
