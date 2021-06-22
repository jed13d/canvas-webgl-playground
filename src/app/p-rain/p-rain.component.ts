import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';
import { MappedPixel, RainParticle, RainParticleSettings } from 'src/app/common/models';

@Component({
  selector: 'app-p-rain',
  templateUrl: './p-rain.component.html',
  styleUrls: ['./p-rain.component.scss']
})
export class PRainComponent implements AfterViewInit {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;

  private image: HTMLImageElement = new Image();
  private particlesArray: RainParticle[] = [];
  private numberOfParticles = 10000;
  private desiredHeight: number = 500;
  private mappedImage: MappedPixel[][] = [];

  /**
   * Form bound variables
   */
  @ViewChild('UsePresetCB')
  private usePresetCB!: ElementRef<HTMLInputElement>;
  private usePresetFlag: boolean = true;

  /**
   * Preset settings for rain particles.
   */
  globalCompositeOperationOptions: string[] = [
     "source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "copy",
     "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue",
     "saturation", "color", "luminosity"
  ];
  selectedRainParticleSettings: number = 0;
  rainParticleSettings: RainParticleSettings[] = [
    {   // 0 - b&w "brightness" "default"
      color: 0,
      direction: "down",
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      name: "B&W Brightness",
      sizeModifier:  1.75,
      velocityModifier: 0.5,
    },
    {   // 1 - color rainy window effect
      color: 1,
      direction: "down",
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      name: "Rainy Window",
      sizeModifier:  5,
      velocityModifier: 0.5,
    }
  ];// =====
  availableDirections: string[] = [
    "down", "down-left", "down-right", "left", "right", "up", "up-left", "up-right"
  ];
  customRainParticleSettings: RainParticleSettings = {
    color: this.selectedRainParticleSettings,
    direction: "down",
    globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
    name: "B&W Brightness",
    sizeModifier:  1.75,
    velocityModifier: 0.5,
  };

  constructor(
    private globalService: GlobalService,) {
      this.image.src = environment.imageSrc;
  }// ==============================

  ngAfterViewInit(): void {
    this.usePresetCB.nativeElement.checked = this.usePresetFlag;
    this.setupLoadListener();
  }// ==============================

  /**
   * Sets the customRainParticleSettings to use white particles.
   * Alternate to selectCustomMappedColors.
   */
  selectCustomBlackAndWhite(): void {
    this.customRainParticleSettings.color = 0;
    this.selectCustomRainParticleSettings();
  }// ==============================

    /**
     * Sets the direction which the particles will flow towards.
     */
  selectCustomDirection(event: Event): void {
    this.debug((<HTMLSelectElement>event.target).value);
    this.customRainParticleSettings.direction = (<HTMLSelectElement>event.target).value;
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectCustomGlobalCompositeOperationOptions(event: Event): void {
    this.debug((<HTMLSelectElement>event.target).value);
    this.customRainParticleSettings.globalCompositeOperationOptions = (<HTMLSelectElement>event.target).value;
    this.selectCustomRainParticleSettings();
  }// ==============================

  /**
   * Sets the customRainParticleSettings to use the mapped image for colors.
   * Alternate to selectCustomBlackAndWhite.
   */
  selectCustomMappedColors(): void {
    this.customRainParticleSettings.color = 1;
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectCustomRainParticleSettings(): void {
    if(this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = false;
    }// =====
    this.setRainParticleSettings();
  }// ==============================

  selectCustomSize(value: string) {
    this.debug("Selected Size: ".concat(value));
    this.customRainParticleSettings.sizeModifier = parseFloat(value);
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectCustomSpeed(value: string) {
    this.debug("Selected Speed: ".concat(value));
    this.customRainParticleSettings.velocityModifier = parseFloat(value);
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectPresetRainParticleSettings(event: Event): void  {
    this.debug("Preset selected: ".concat((<HTMLSelectElement>event.target).value));
    if(!this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = true;
    }// =====
    this.selectedRainParticleSettings = parseInt((<HTMLSelectElement>event.target).value);
    this.setRainParticleSettings();
  }// ==============================

  toggleUsePresetFlag(): void  {
    this.usePresetFlag = this.usePresetCB.nativeElement.checked;
    this.setRainParticleSettings();
  }// ==============================

  private animate(): void  {
    this.context!.globalAlpha = 0.05;

    this.context!.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context!.fillStyle = 'rgb(0, 0, 0, 1)';
    this.context!.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let alphaModifier = 0.05;
    for(let i = 0; i < this.particlesArray.length; i++) {
      this.context!.globalAlpha = (this.particlesArray[i].getSpeed() * alphaModifier);
      this.particlesArray[i].update(this.context!, this.mappedImage);
    }// =====
    requestAnimationFrame(() => {
      this.animate();
    });// =====
  }// ==============================

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message
   * @param optionalParams
   */
  private debug(message?: any, ...optionalParams: any) {
    if(environment.debugging) {
      if(optionalParams.length > 0) {
        this.globalService.debug("PRainComponent:\n".concat(message), optionalParams);
      } else {
        this.globalService.debug("PRainComponent:\n".concat(message));
      }// =====
    }// =====
  }// ==============================

  private initializeRainParticles(): void  {
    for(let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray.push(new RainParticle(this.canvas.nativeElement.width, this.canvas.nativeElement.height, this.rainParticleSettings[this.selectedRainParticleSettings]));
    }// =====
  }// ==============================

  private setRainParticleSettings(): void {
    let tempSettingsObj = this.usePresetFlag ? this.rainParticleSettings[this.selectedRainParticleSettings] : this.customRainParticleSettings;
    for(let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray[i].setRainParticleSettings(tempSettingsObj);
    }// =====
  }// ==============================

  private setupCanvas(): void {

  let imageScaler: number = 1;
  if(this.image.height > this.desiredHeight) {
    imageScaler = Math.floor(this.image.height / this.desiredHeight);
    imageScaler = (imageScaler > 0) ? imageScaler : 1;
    this.canvas!.nativeElement.width = this.image.naturalWidth / imageScaler;
    this.canvas!.nativeElement.height = this.image.naturalHeight / imageScaler;
  } else {
    imageScaler = Math.floor(this.desiredHeight / this.image.height);
    imageScaler = (imageScaler > 0) ? imageScaler : 1;
    this.canvas!.nativeElement.width = this.image.naturalWidth * imageScaler;
    this.canvas!.nativeElement.height = this.image.naturalHeight * imageScaler;
  }// =====

    this.globalService.debug("Number of Particles: ".concat(this.numberOfParticles.toString()));

    this.context = this.canvas!.nativeElement.getContext('2d');
    this.debug("canvas: "+ this.canvas!.nativeElement.width +", "+ this.canvas!.nativeElement.height +", "+ imageScaler);
  }// ==============================

  /**
   * Initialize this.mappedImage with MappedPixels
   */
  private setupImageMapping() {
    let pixels = this.context!.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for(let y = 0; y < this.canvas.nativeElement.height; y++) {
      let row: MappedPixel[] = [];
      for(let x = 0; x < this.canvas.nativeElement.width; x++) {
        let red = pixels.data[(y * 4 * pixels.width) + (x * 4)];
        let green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)];
        let blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)];
        let brightness = this.globalService.calculatePixelRelativeBrightness(red, green, blue);
        row.push(new MappedPixel(
          brightness,
          "rgb("+ red +", "+ green +", "+ blue +")"
        ));
      }// =====
      this.mappedImage.push(row);
    }// =====

    console.debug(this.mappedImage);
  }// ==============================

  private setupLoadListener(): void  {
    this.image.addEventListener('load', () => {
      this.setupCanvas();
      this.globalService.drawImage(this.context!, this.image, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.setupImageMapping();
      this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.initializeRainParticles();
      this.animate();
    });// =====
  }// ==============================

}// ==============================
