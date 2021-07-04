import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

import { environment } from 'src/environments/environment';
import { GlobalService } from 'src/app/services/global.service';
import { ColorObj, CssColorObj, MappedPixel, RainParticle, RainParticleSettings } from 'src/app/common/models';

@Component({
  selector: 'app-p-rain',
  templateUrl: './p-rain.component.html',
  styleUrls: ['./p-rain.component.scss']
})
export class PRainComponent implements AfterViewInit, OnDestroy {

  @ViewChild('Canvas')
  private canvas!: ElementRef<HTMLCanvasElement>;
  private context?: CanvasRenderingContext2D | null = null;

  private image: HTMLImageElement = new Image();
  private particlesArray: RainParticle[] = [];
  private numberOfParticles = 8000;
  private desiredHeight: number = 500;
  private mappedImage: MappedPixel[][] = [];

  @ViewChild('UsePresetCB')
  private usePresetCB!: ElementRef<HTMLInputElement>;
  private usePresetFlag: boolean = true;

  @ViewChild('ClearCanvasCB')
  private clearCanvasCB!: ElementRef<HTMLInputElement>;
  private clearCanvasFlag: boolean = false;

  @ViewChild('SwirlCB')
  private swirlCB!: ElementRef<HTMLInputElement>;

  @ViewChild('MappedColorRadio')
  private mappedColorRadio!: ElementRef<HTMLInputElement>;

  @ViewChild('CustomColorRadio')
  private customColorRadio!: ElementRef<HTMLInputElement>;

  alphaModifier: number = 0.15;

  private animationId: number = 0;

  /**
   * Preset settings for rain particles.
   * Also all custom settings and variables for UI.
   */
  globalCompositeOperationOptions: string[] = [
     "source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out",
     "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge",
     "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"
  ];

  availableCssColors: CssColorObj[] = this.globalService.availableCssColors;

  // imported variables
  availableDirections: string[] = RainParticle.availableDirections;
  availableColorSettings: string[] = RainParticle.availableColorSettings;

  selectedRainParticleSettings: number = 2;

  rainParticleSettings: RainParticleSettings[] = [
    {   // 0 - b&w "brightness" "default"
      color: ColorObj.getWhiteRgb(),
      direction: this.availableDirections[0],
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      gradient: null,
      name: "White Bright",
      sizeModifier:  1.5,
      swirl: false,
      velocityModifier: 0.5,
    },
    {   // 1 - color rainy window effect
      color: this.availableColorSettings[1],
      direction: this.availableDirections[0],
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      gradient: null,
      name: "Rainy Window",
      sizeModifier:  5,
      swirl: false,
      velocityModifier: 0.5,
    },
    {   // 2 - rising fire
      color: this.availableColorSettings[1],
      direction: this.availableDirections[7],
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      gradient: null,
      name: "Rising Fire",
      sizeModifier:  3,
      swirl: true,
      velocityModifier: 2.0,
    }
  ];// =====

  customColorObj: ColorObj = new ColorObj();
  customRainParticleSettings!: RainParticleSettings;

  @ViewChild('BlueInput')
  private blueInput!: ElementRef<HTMLInputElement>;

  @ViewChild('GreenInput')
  private greenInput!: ElementRef<HTMLInputElement>;

  @ViewChild('RedInput')
  private redInput!: ElementRef<HTMLInputElement>;

  constructor(
    private globalService: GlobalService,) {
      this.image.src = environment.imageSrc;
      this.matchCustomSettingsToPreset();
      this.customRainParticleSettings.name = "Custom Settings";
  }// ==============================

  ngAfterViewInit(): void {
    this.usePresetCB.nativeElement.checked = this.usePresetFlag;
    this.clearCanvasCB.nativeElement.checked = this.clearCanvasFlag;
    this.swirlCB.nativeElement.checked = this.customRainParticleSettings.swirl;
    switch(this.customRainParticleSettings.color) {
      case this.availableColorSettings[0]:
        break;
      case this.availableColorSettings[1]:
        this.mappedColorRadio.nativeElement.checked = true;
        break;
      default:
        this.customColorRadio.nativeElement.checked = true;
        break;
    }
    this.setupLoadListener();
  }// ==============================

  ngOnDestroy(): void {
    this.debug("ngOnDestroy");
    this.globalService.clearCanvas(this.context!, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    cancelAnimationFrame(this.animationId);
  }// ==============================

  selectAlphaModifier(value: number) {
    this.debug("Selected Alpha: "+ value);
    this.alphaModifier = value;
  }// ==============================

  /**
   * Sets the customRainParticleSettings to use white particles.
   * Alternate to selectCustomMappedColors.
   */
  selectCustomColor(preset: boolean, event: Event | null = null): void {
    this.customColorRadio.nativeElement.checked = true;
    if(preset && event !== null) {
      this.debug((<HTMLSelectElement>event.target).value);
      let color = this.availableCssColors.find(cObj => cObj.name === (<HTMLSelectElement>event.target).value);

      let commaOneIdx = color!.rgb.indexOf(',');
      let redIdx = 4;
      this.redInput.nativeElement.value = color!.rgb.substr(redIdx, (commaOneIdx - redIdx));

      let commaTwoIdx = color!.rgb.indexOf(',', (commaOneIdx + 1));
      let greenIdx = commaOneIdx + 2;
      this.greenInput.nativeElement.value = color!.rgb.substr(greenIdx, (commaTwoIdx - greenIdx));

      let blueIdx = commaTwoIdx + 2;
      let closeParens = color!.rgb.indexOf(')');
      this.blueInput.nativeElement.value = color!.rgb.substr(blueIdx, (closeParens - blueIdx));

      this.customRainParticleSettings.color = color!.rgb;
    } else {
      this.customRainParticleSettings.color = ColorObj.getRgb(this.blueInput.nativeElement.value, this.greenInput.nativeElement.value,this.redInput.nativeElement.value);
    }// =====
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
    this.mappedColorRadio.nativeElement.checked = true;
    this.customRainParticleSettings.color = this.availableColorSettings[1];
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectCustomRainParticleSettings(): void {
    if(this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = false;
    }// =====
    this.setRainParticleSettings();
  }// ==============================

  selectCustomSize(value: number) {
    this.debug("Selected Size: "+ value);
    this.customRainParticleSettings.sizeModifier = value;
    this.selectCustomRainParticleSettings();
  }// ==============================

  selectCustomSpeed(value: number): void {
    this.debug("Selected Speed: "+ value);
    this.customRainParticleSettings.velocityModifier = value;
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

  toggleClearCanvasFlag(): void {
    this.debug("toggleClearCanvasFlag: ", this.clearCanvasCB.nativeElement.checked);
    this.clearCanvasFlag = this.clearCanvasCB.nativeElement.checked;
  }// ==============================

  toggleSwirlFlag(): void {
    this.debug("toggleSwirlFlag: ", this.swirlCB.nativeElement.checked);
    this.customRainParticleSettings.swirl = this.swirlCB.nativeElement.checked;
    this.selectCustomRainParticleSettings();
  }// ==============================

  toggleUsePresetFlag(): void {
    this.debug("toggleUsePresetFlag: ", this.usePresetCB.nativeElement.checked);
    this.usePresetFlag = this.usePresetCB.nativeElement.checked;
    this.setRainParticleSettings();
  }// ==============================

  /**
   * All the animation logic, from top level
   */
  private animate(): void  {
    this.context!.globalAlpha = this.alphaModifier;

    if(this.clearCanvasFlag) {
      this.context!.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
    if(this.blueInput.nativeElement.value === "0"
      && this.greenInput.nativeElement.value === "0"
      && this.redInput.nativeElement.value === "0") {
        this.context!.fillStyle = 'rgb(255, 255, 255, 1)';
    } else {
      this.context!.fillStyle = 'rgb(0, 0, 0, 1)';
    }// =====
    this.context!.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let alphaModifier = 0.05;
    for(let i = 0; i < this.particlesArray.length; i++) {
      this.context!.globalAlpha = (this.particlesArray[i].getSpeed() * alphaModifier);
      this.particlesArray[i].update(this.context!, this.mappedImage);
    }// =====
    this.animationId = requestAnimationFrame(() => {
      this.animate();
    });// =====
  }// ==============================

  /**
   * Wrapper method around console.log to output only when in debugging mode.
   * It's parameters are set up just like console.log for ease of use.
   * @param message
   * @param optionalParams
   */
  private debug(message?: any, ...optionalParams: any): void {
    if(environment.debugging) {
      if(optionalParams.length > 0) {
        this.globalService.debug("PRainComponent:\n".concat(message), optionalParams);
      } else {
        this.globalService.debug("PRainComponent:\n".concat(message));
      }// =====
    }// =====
  }// ==============================

  /**
   * Creates and initializes all the particles with the default settings
   */
  private initializeRainParticles(): void  {
    for(let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray.push(new RainParticle(this.canvas.nativeElement.width, this.canvas.nativeElement.height, this.rainParticleSettings[this.selectedRainParticleSettings]));
    }// =====
  }// ==============================

  private matchCustomSettingsToPreset(): void {
    this.customRainParticleSettings = Object.assign({}, this.rainParticleSettings[this.selectedRainParticleSettings]);
    // if((typeof this.customRainParticleSettings.color) === ParticleColorSetting) {
    //   this.customColorObj.setFromRgb(this.customRainParticleSettings.color);
    // }// =====
    console.log(typeof this.customRainParticleSettings.color);
  }// ==============================

  /**
   * Separated out so settings can be changed on the fly,
   * note: new settings aren't visible until the particle is reset
   */
  private setRainParticleSettings(): void {
    let tempSettingsObj = this.usePresetFlag ? this.rainParticleSettings[this.selectedRainParticleSettings] : this.customRainParticleSettings;
    for(let i = 0; i < this.numberOfParticles; i++) {
      this.particlesArray[i].setRainParticleSettings(tempSettingsObj);
    }// =====
  }// ==============================

  /**
   * Initialize and setup canvas and context deminsions based on the image used
   */
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
  private setupImageMapping(): void {
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

  /**
   * Sets up the load listener on the image to:
   *    - initialize the canvas based on the image dimensions
   *      - do this here to avoid access errors
   *    - map the image data to an array
   *    - initialize the rain particles
   *    - start the animation
   */
  private setupLoadListener(): void  {
    this.image.addEventListener('load', () => {
      this.setupCanvas();
      this.globalService.drawImage(this.context!, this.image, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.setupImageMapping();
      this.initializeRainParticles();
      this.animate();
    });// =====
  }// ==============================

}// ==============================
