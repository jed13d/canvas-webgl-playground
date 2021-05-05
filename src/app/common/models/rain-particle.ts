import { MappedPixel } from 'src/app/common/models';

export class RainParticle {
    // definite assignment allowing call to method to assign without error
    private x!: number;
    private y!: number;
    private size!: number;
    private velocity!: number;

    private canvasWidth: number;
    private canvasHeight: number;
    private speed: number;

    // modifiers
    private direction: string = 'down';                 // default 'down'

    private globalCompositeOperationOptions: string[] = [
        "source-over", "xor", "overlay", "difference", "exclusion", "hue", "saturation", "color", "luminosity"
    ];

    private selectedModifierSet: number = 0;
    private modifierSets: {
        direction: string;
        globalCompositeOperationOptions: string;
        sizeModifier: number;
        speedModifier: number;
        velocityModifier: number;
    }[] = [
        {   // 0 - b&w "brightness" "default"
            direction: "down",
            globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
            sizeModifier:  1,
            speedModifier: 0.75,
            velocityModifier: 0.5,
        },
        {   // 1 - color rainy window effect
            direction: "down",
            globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
            sizeModifier:  Math.random() * 5,
            speedModifier: 0.75,
            velocityModifier: 0.5,
        }
    ];

    constructor(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.speed = 0;
        this.resetPosition();
    }// ==============================

    draw(context: CanvasRenderingContext2D, mappedImage: MappedPixel[][]) {
        context.beginPath();
        switch(this.selectedModifierSet) {
            case 1:
                context.fillStyle = mappedImage[Math.floor(this.y)][Math.floor(this.x)].getColor();
                break;
            case 0:
            default:
                context.fillStyle = 'white';
                break;
        }
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }// ==============================

    getSpeed() {
      return this.speed;
    }

    resetPosition() {
        this.size = Math.random() * this.modifierSets[this.selectedModifierSet].sizeModifier;
        this.velocity = Math.random() * this.modifierSets[this.selectedModifierSet].velocityModifier;
        switch (this.modifierSets[this.selectedModifierSet].direction) {

            case 'up':
                this.y = this.canvasHeight - 1;
                this.x = Math.random() * this.canvasWidth;
                break;

            default:
            case 'down':
                this.y = 0;
                this.x = Math.random() * this.canvasWidth;
                break;
        }
    }// ==============================

    update(context: CanvasRenderingContext2D, mappedImage: MappedPixel[][]) {
        this.updateMovement();
        this.speed = mappedImage[Math.floor(this.y)][Math.floor(this.x)].getBrightness() * this.modifierSets[this.selectedModifierSet].speedModifier;
        context.globalCompositeOperation = this.modifierSets[this.selectedModifierSet].globalCompositeOperationOptions;
        this.draw(context, mappedImage);
    }// ==============================

    updateMovement() {
        let movement = (1.9 - this.speed) + this.velocity;
        movement /= 3;
        switch (this.modifierSets[this.selectedModifierSet].direction) {
            case 'up':
                this.y -= movement;
                if(this.y <= 0) this.resetPosition();
                break;

            default:
            case 'down':
                this.y += movement;
                if(this.y >= this.canvasHeight) this.resetPosition();
                break;
        }
        if(this.y >= this.canvasHeight || this.x >= this.canvasWidth
            || this.y <= 0 || this.x <= 0) {
            this.resetPosition();
        }
    }
}// ==============================
