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
  private desiredNumberOfPixels: number = 250000;
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
  private globalCompositeOperationOptions: string[] = [
     "source-over", "xor", "overlay", "difference", "exclusion", "hue", "saturation", "color", "luminosity"
  ];
  private selectedRainParticleSettings: number = 0;
  rainParticleSettings: RainParticleSettings[] = [
    {   // 0 - b&w "brightness" "default"
      color: 0,
      direction: "down",
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      name: "B&W Brightness",
      sizeModifier:  1.75,
      speedModifier: 0.5,
      velocityModifier: 0.5,
    },
    {   // 1 - color rainy window effect
      color: 1,
      direction: "down",
      globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
      name: "Rainy Window",
      sizeModifier:  Math.random() * 5,
      speedModifier: 0.75,
      velocityModifier: 0.5,
    }
  ];// =====
  customRainParticleSettings: RainParticleSettings = {
    color: this.selectedRainParticleSettings,
    direction: "down",
    globalCompositeOperationOptions: this.globalCompositeOperationOptions[0],
    name: "B&W Brightness",
    sizeModifier:  1.75,
    speedModifier: 0.5,
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

  selectCustomRainParticleSettings(): void {
    if(this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = false;
    }// =====
    this.setRainParticleSettings();
  }// ==============================

  selectPresetRainParticleSettings(index: number): void  {
    this.debug("index argument: "+ index);
    if(!this.usePresetFlag) {
      this.usePresetFlag = this.usePresetCB.nativeElement.checked = true;
    }// =====
    this.selectedRainParticleSettings = index;
    this.setRainParticleSettings();
  }// ==============================

  toggleUsePresetFlag(): void  {
    this.usePresetFlag = this.usePresetCB.nativeElement.checked;
    this.setRainParticleSettings();
  }// ==============================

  private animate(): void  {
    this.context!.globalAlpha = 0.05;

    this.context!.fillStyle = 'rgb(0, 0, 0)';
    this.context!.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    let alphaModifier = 0.05;
    for(let i = 0; i < this.particlesArray.length; i++) {
      this.particlesArray[i].update(this.context!, this.mappedImage);
      this.context!.globalAlpha = (this.particlesArray[i].getSpeed() * alphaModifier);
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
        this.globalService.debug("PRainComponent:\n", message, optionalParams);
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
    let pixelCount = this.image.width * this.image.height;
    let imageScaler: number = 1;
    if(pixelCount > this.desiredNumberOfPixels) {
      imageScaler = Math.floor(pixelCount / this.desiredNumberOfPixels) / 2;
      imageScaler = (imageScaler > 0) ? imageScaler : 1;
      this.canvas!.nativeElement.width = this.image.width / imageScaler;
      this.canvas!.nativeElement.height = this.image.width / imageScaler;
    } else if(pixelCount < this.desiredNumberOfPixels) {
      imageScaler = Math.floor(this.desiredNumberOfPixels / pixelCount) / 2;
      imageScaler = (imageScaler > 0) ? imageScaler : 1;
      this.canvas!.nativeElement.width = this.image.width * imageScaler;
      this.canvas!.nativeElement.height = this.image.width * imageScaler;
    }// =====

    this.numberOfParticles = (this.canvas.nativeElement.height * this.canvas.nativeElement.width) / 10;

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
  }// ==============================

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
