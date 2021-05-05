export class MappedPixel {
    private brightness: number;
    private color: string;

    constructor(brightness: number, color: string) {
        this.brightness = brightness;
        this.color = color;
    }// ==============================

    public getBrightness() {
        return this.brightness;
    }// ==============================

    public getColor() {
        return this.color;
    }// ==============================
}// ==============================